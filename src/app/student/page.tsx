'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import StudentStatCard from './components/StudentStatCard';
import styles from './page.module.css';
import { CheckCircle2, TrendingUp, Clock, Loader2, Calendar } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function StudentDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch Student Profile for Grade
    const { data: profile } = await supabase
      .from('profiles')
      .select('grade, institution_id')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    // 2. Fetch Attendance
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('status')
      .eq('student_id', user.id);
    
    const totalSlots = attendanceData?.length || 0;
    const presentSlots = attendanceData?.filter(a => a.status === 'Present' || a.status === 'Late').length || 0;
    const attendancePercent = totalSlots > 0 ? ((presentSlots / totalSlots) * 100).toFixed(1) : '0';

    // 3. Fetch Results (GPA Calculation)
    const { data: resultsData } = await supabase
      .from('results')
      .select('subject_marks')
      .eq('student_id', user.id);
    
    let totalMarksSum = 0;
    let subjectsCount = 0;
    resultsData?.forEach(r => {
      const marksObj = r.subject_marks as Record<string, any>;
      Object.values(marksObj).forEach(m => {
        const val = parseFloat(m);
        if (!isNaN(val)) {
          totalMarksSum += val;
          subjectsCount++;
        }
      });
    });
    const avgGrade = subjectsCount > 0 ? (totalMarksSum / subjectsCount).toFixed(1) : 'N/A';

    // 4. Fetch Pending Assignments
    // We count assignments for the student's grade that aren't yet submitted/graded
    const { data: allAssignments } = await supabase
      .from('assignments')
      .select('id')
      .eq('grade', profile.grade);
    
    const { data: studentSubmissions } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, status')
      .eq('student_id', user.id);
    
    const submittedIds = new Set(
      studentSubmissions
        ?.filter(s => s.status === 'submitted' || s.status === 'graded')
        .map(s => s.assignment_id) || []
    );

    const pendingCount = (allAssignments?.filter(a => !submittedIds.has(a.id)).length) || 0;

    // 5. Fetch Today's Schedule
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const { data: timetableData } = await supabase
      .from('timetables')
      .select(`
        *,
        faculty:profiles!faculty_id (first_name, last_name)
      `)
      .eq('grade', profile.grade)
      .eq('day_of_week', today)
      .order('start_time');

    setSchedule(timetableData || []);

    setStats([
      {
        title: 'Attendance',
        value: `${attendancePercent}%`,
        subtext: parseFloat(attendancePercent) > 75 ? 'Good standing' : 'Low attendance',
        subtextColor: parseFloat(attendancePercent) > 75 ? 'success' : 'warning',
        subtextIcon: <CheckCircle2 size={16} />
      },
      {
        title: 'Average Grade',
        value: avgGrade !== 'N/A' ? `${avgGrade}%` : 'N/A',
        subtext: avgGrade !== 'N/A' ? 'Based on latest results' : 'No results yet',
        subtextColor: 'info',
        subtextIcon: <TrendingUp size={16} />
      },
      {
        title: 'Pending Tasks',
        value: pendingCount.toString(),
        subtext: 'Assignments to submit',
        subtextColor: pendingCount > 0 ? 'warning' : 'success',
        subtextIcon: <Clock size={16} />
      },
      {
        title: 'Fees Balance',
        value: '₹0',
        subtext: 'All cleared',
        subtextColor: 'success',
        subtextIcon: <CheckCircle2 size={16} />
      }
    ]);

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.spin} size={48} color="var(--primary)" />
        <p>Syncing your dashboard...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Student" 
        titleHighlight="Overview" 
        actionElement={
          <button className={styles.refreshBtn} onClick={fetchDashboardData}>
            <Calendar size={16} /> Today's View
          </button>
        }
      />

      <section className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <StudentStatCard key={idx} {...stat} />
        ))}
      </section>

      <section className={styles.scheduleSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
          <span className={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        {schedule.length > 0 ? (
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Room</th>
                <th>Professor</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</td>
                  <td>{item.subject}</td>
                  <td>{item.room}</td>
                  <td>{item.faculty?.first_name} {item.faculty?.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptySchedule}>
            <Calendar size={48} color="#cbd5e1" />
            <p>No classes scheduled for today.</p>
          </div>
        )}
      </section>
    </main>
  );
}
