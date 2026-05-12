'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Calendar, Download, Loader2, TrendingUp, Users, AlertCircle, Clock } from 'lucide-react';

const GRADES = ['Playgroup', 'Nursery', 'Pre-Primary 1', 'Pre-Primary 2'];

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, rate: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const supabase = createClient();

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    // Fetch all attendance for the selected date
    const { data: attData } = await supabase
      .from('attendance')
      .select('*, timetables(subject, start_time)')
      .eq('institution_id', profile.institution_id)
      .eq('date', date);

    // Fetch all scheduled slots for today (to show classes even with 0 attendance)
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const { data: slots } = await supabase
      .from('timetables')
      .select('*')
      .eq('institution_id', profile.institution_id)
      .eq('day_of_week', dayOfWeek);

    // Fetch student counts per grade
    const { data: students } = await supabase
      .from('profiles')
      .select('grade')
      .eq('institution_id', profile.institution_id)
      .eq('role', 'student');

    if (slots) {
      const summary = slots.map(slot => {
        const slotAtt = attData?.filter(a => a.timetable_id === slot.id) || [];
        const totalInGrade = students?.filter(s => s.grade === slot.grade).length || 0;
        const present = slotAtt.filter(a => a.status === 'Present').length;
        const absent = slotAtt.filter(a => a.status === 'Absent').length;
        const late = slotAtt.filter(a => a.status === 'Late').length;
        const percent = totalInGrade > 0 ? Math.round((present / totalInGrade) * 100) : 0;
        
        return { 
          id: slot.id,
          grade: slot.grade, 
          subject: slot.subject,
          time: slot.start_time.substring(0, 5),
          totalInGrade, present, absent, late, percent 
        };
      });

      setRecords(summary);
      
      const totalPresent = attData?.filter(a => a.status === 'Present').length || 0;
      const totalAbsent = attData?.filter(a => a.status === 'Absent').length || 0;
      const totalLate = attData?.filter(a => a.status === 'Late').length || 0;
      const totalPossible = summary.reduce((acc, s) => acc + s.totalInGrade, 0);
      const totalRate = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
      
      setStats({ present: totalPresent, absent: totalAbsent, late: totalLate, rate: totalRate });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Live"
        titleHighlight="Attendance"
        actionElement={
          <div className={styles.headerActions}>
            <div className={styles.datePicker}>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <button className={styles.exportBtn}>
              <Download size={16} /> Export
            </button>
          </div>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><Users size={16} /> Present Today</div>
          <div className={styles.statValue}>{isLoading ? '...' : stats.present}</div>
          <div className={styles.progressBar}><div className={styles.fillGreen} style={{ width: `${stats.rate}%` }}></div></div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><AlertCircle size={16} /> Absentees</div>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{isLoading ? '...' : stats.absent}</div>
          <div className={styles.statusPill}>{stats.absent > 5 ? 'Action Required' : 'Normal'}</div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><Clock size={16} /> Late Entry</div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{isLoading ? '...' : stats.late}</div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><TrendingUp size={16} /> Success Rate</div>
          <div className={styles.statValue}>{isLoading ? '...' : stats.rate}%</div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Class-wise Summary</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Class / Grade</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Total Students</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /> Loading...</td></tr>
            ) : records.map((row) => (
              <tr key={row.id}>
                <td className={styles.gradeCell}>{row.grade}</td>
                <td className={styles.subjectCell}>{row.subject}</td>
                <td>{row.time}</td>
                <td>{row.totalInGrade}</td>
                <td>{row.present}</td>
                <td>{row.absent}</td>
                <td>{row.late}</td>
                <td>{row.percent}%</td>
                <td>
                  <span className={`${styles.statusBadge} ${row.percent >= 90 ? styles.bgGreen : row.percent >= 75 ? styles.bgYellow : styles.bgRed}`}>
                    {row.percent >= 90 ? 'Excellent' : row.percent >= 75 ? 'Good' : 'Critical'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
