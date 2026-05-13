'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../components/PageHeader';
import FacultyStatCard from './components/FacultyStatCard';
import FacultySchedule from './components/FacultySchedule';
import { Clock, Users, FileCheck, Landmark } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface Stat {
  title: string;
  value: string | number;
  subtext: string;
  subtextColor: 'success' | 'warning' | 'info' | 'text';
  icon: React.ReactNode;
}

export default function FacultyDashboard() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([
    { title: 'Classes Today', value: '0', subtext: 'No sessions scheduled', subtextColor: 'text', icon: <Clock size={20} /> },
    { title: 'Total Students', value: '0', subtext: 'In your assigned grades', subtextColor: 'text', icon: <Users size={20} /> },
    { title: 'Pending Grades', value: '0', subtext: 'All caught up', subtextColor: 'text', icon: <FileCheck size={20} /> },
    { title: 'Avg. Attendance', value: '0%', subtext: 'No records found', subtextColor: 'text', icon: <Landmark size={20} /> }
  ]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

      // 1. Today's Schedule
      const { data: scheduleData } = await supabase
        .from('timetables')
        .select('*')
        .eq('faculty_id', user.id)
        .eq('day_of_week', today)
        .order('start_time', { ascending: true });

      if (scheduleData) {
        setSchedule(scheduleData.map(s => ({
          time: `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`,
          subject: s.subject,
          room: s.room || 'N/A',
          action: 'Upcoming' // Default for now, could be dynamic based on current time
        })));
      }

      // 2. All faculty grades for student count
      const { data: allTimetables } = await supabase
        .from('timetables')
        .select('grade')
        .eq('faculty_id', user.id);
      
      const distinctGrades = Array.from(new Set(allTimetables?.map(t => t.grade) || []));

      // 3. Total Students
      let totalStudents = 0;
      if (distinctGrades.length > 0) {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student')
          .in('grade', distinctGrades);
        totalStudents = count || 0;
      }

      // 4. Advanced Pending Grades Calculation
      // Count exactly how many student results are missing for exams currently in 'Grading' status
      const { data: activeExams } = await supabase
        .from('exams')
        .select('id, grade')
        .eq('status', 'Grading')
        .in('grade', distinctGrades);
      
      let totalPendingResults = 0;
      if (activeExams && activeExams.length > 0) {
        for (const exam of activeExams) {
          // Get total students in this grade
          const { count: studentCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .eq('grade', exam.grade);
          
          // Get results already entered for this exam
          const { count: resultsCount } = await supabase
            .from('results')
            .select('*', { count: 'exact', head: true })
            .eq('exam_id', exam.id);
          
          totalPendingResults += ((studentCount || 0) - (resultsCount || 0));
        }
      }

      // 5. Avg Attendance (Lifetime average for this faculty's sessions)
      const { data: attRecords } = await supabase
        .from('attendance')
        .select('status')
        .eq('faculty_id', user.id);
      
      let avgAtt = 0;
      if (attRecords && attRecords.length > 0) {
        const presentCount = attRecords.filter(a => a.status === 'Present').length;
        avgAtt = Math.round((presentCount / attRecords.length) * 100);
      }

      // 6. Recent Submissions (Latest entries from results table)
      const { data: recentResults } = await supabase
        .from('results')
        .select('*, profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentResults) {
        setSubmissions(recentResults.map(r => ({
          id: r.id,
          student: `${r.profiles.first_name} ${r.profiles.last_name}`,
          assignment: r.remarks || 'Marks Uploaded',
          status: 'New',
          time: new Date(r.created_at).toLocaleDateString(),
          initial: r.profiles.first_name[0] + r.profiles.last_name[0],
          color: '#6366f1'
        })));
      }

      // Update Stats with more dynamic subtexts
      setStats([
        {
          title: 'Classes Today',
          value: scheduleData?.length.toString() || '0',
          subtext: scheduleData && scheduleData.length > 0 ? `Next at ${scheduleData[0].start_time.substring(0, 5)}` : 'No more classes',
          subtextColor: 'success',
          icon: <Clock size={20} />
        },
        {
          title: 'Total Students',
          value: totalStudents.toString(),
          subtext: `Across ${distinctGrades.length} grades`,
          subtextColor: 'info',
          icon: <Users size={20} />
        },
        {
          title: 'Pending Grades',
          value: totalPendingResults.toString(),
          subtext: totalPendingResults > 0 ? `${activeExams?.length} exams in progress` : 'All caught up',
          subtextColor: totalPendingResults > 0 ? 'warning' : 'success',
          icon: <FileCheck size={20} />
        },
        {
          title: 'Avg. Attendance',
          value: `${avgAtt}%`,
          subtext: avgAtt > 85 ? 'Above threshold' : 'Requires attention',
          subtextColor: avgAtt > 85 ? 'success' : 'warning',
          icon: <Landmark size={20} />
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Faculty" 
        titleHighlight="Portal" 
      />

      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
          <p>Loading Dashboard...</p>
        </div>
      ) : (
        <>
          <section className={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <FacultyStatCard key={idx} {...stat} />
            ))}
          </section>
    
          <div className={styles.dashboardContent}>
            <section className={styles.scheduleSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
                <button className={styles.viewBtn}>View Calendar</button>
              </div>
              <FacultySchedule type="daily" items={schedule} />
            </section>
    
            <aside className={styles.submissionsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Submissions</h2>
              </div>
              <div className={styles.submissionsList}>
                {submissions.length > 0 ? submissions.map((sub) => (
                  <div key={sub.id} className={styles.submissionItem}>
                    <div 
                      className={styles.avatar} 
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.initial}
                    </div>
                    <div className={styles.submissionInfo}>
                      <div className={styles.studentName}>{sub.student}</div>
                      <div className={styles.assignmentName}>{sub.assignment}</div>
                    </div>
                    <div className={styles.submissionStatus}>
                      <span className={`${styles.statusBadge} ${styles[sub.status.toLowerCase().replace(/[^a-z]/g, '')]}`}>
                        {sub.status}
                      </span>
                      <span className={styles.timeText}>{sub.time}</span>
                    </div>
                  </div>
                )) : (
                  <div className={styles.emptyState}>No recent submissions</div>
                )}
                <button className={styles.viewAllBtn}>View All Submissions</button>
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
