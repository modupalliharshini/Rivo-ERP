'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

const SUMMARY_STATS = [
  { label: 'Total Classes', value: '120', textClass: 'textDark' },
  { label: 'Present', value: '111', textClass: 'textGreen' },
  { label: 'Absent', value: '6', textClass: 'textRed' },
  { label: 'Leaves', value: '3', textClass: 'textBlue' }
];

const ATTENDANCE_DATA = [
  { subject: 'Advanced Data Structures', professor: 'Dr. Alan Turing', total: 30, attended: 28, percentage: '93.3%', status: 'Excellent', statusClass: 'badgeExcellent' },
  { subject: 'Quantum Mechanics', professor: 'Prof. Richard Feynman', total: 28, attended: 24, percentage: '85.7%', status: 'Good', statusClass: 'badgeGood' },
  { subject: 'Discrete Mathematics', professor: 'Dr. Grace Hopper', total: 32, attended: 31, percentage: '96.8%', status: 'Excellent', statusClass: 'badgeExcellent' },
  { subject: 'AI Ethics', professor: 'Ms. Emily Brown', total: 30, attended: 28, percentage: '93.3%', status: 'Excellent', statusClass: 'badgeExcellent' }
];

export default function AttendancePage() {
  const OverallStat = (
    <div className={styles.headerStat}>
      <span className={styles.headerStatLabel}>Overall Attendance</span>
      <span className={styles.headerStatValue}>92.5%</span>
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
        {SUMMARY_STATS.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={`${styles.statValue} ${styles[stat.textClass]}`}>{stat.value}</span>
          </div>
        ))}
      </section>

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Subject-wise Analysis</h2>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Professor</th>
              <th>Total</th>
              <th>Attended</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ATTENDANCE_DATA.map((row, idx) => (
              <tr key={idx}>
                <td className={styles.subjectName}>{row.subject}</td>
                <td>{row.professor}</td>
                <td>{row.total}</td>
                <td>{row.attended}</td>
                <td>{row.percentage}</td>
                <td>
                  <span className={`${styles.badge} ${styles[row.statusClass]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
