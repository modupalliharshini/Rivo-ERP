'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Loader2, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StudentAttendancePage() {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: '0%' });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', user.id)
        .order('date', { ascending: false });

      if (data) {
        setHistory(data);
        const total = data.length;
        const present = data.filter(d => d.status === 'Present').length;
        const absent = data.filter(d => d.status === 'Absent').length;
        const late = data.filter(d => d.status === 'Late').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) + '%' : '0%';
        
        setStats({ total, present, absent, late, percentage });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Attendance...</div>;

  const OverallStat = (
    <div className={styles.headerStat}>
      <span className={styles.headerStatLabel}>Overall Attendance</span>
      <span className={styles.headerStatValue}>{stats.percentage}</span>
    </div>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Attendance" 
        actionElement={OverallStat}
      />

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Days</span>
          <span className={`${styles.statValue} ${styles.textDark}`}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Present</span>
          <span className={`${styles.statValue} ${styles.textGreen}`}>{stats.present}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Absent</span>
          <span className={`${styles.statValue} ${styles.textRed}`}>{stats.absent}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Late</span>
          <span className={`${styles.statValue} ${styles.textBlue}`}>{stats.late}</span>
        </div>
      </section>

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Attendance History</h2>
        
        {history.length === 0 ? (
          <div className={styles.empty}>No attendance records found yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id}>
                  <td className={styles.dateCell}>{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>{new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                  <td>
                    <span className={`${styles.badge} ${
                      row.status === 'Present' ? styles.badgePresent : 
                      row.status === 'Absent' ? styles.badgeAbsent : 
                      styles.badgeLate
                    }`}>
                      {row.status === 'Present' && <CheckCircle2 size={12} />}
                      {row.status === 'Absent' && <XCircle size={12} />}
                      {row.status === 'Late' && <Clock size={12} />}
                      {row.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Automated entry</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
