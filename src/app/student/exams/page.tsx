'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

const UPCOMING_EXAMS = [
  { subject: 'Physics', date: 'Oct 30, 2026', time: '10:00 AM', type: 'Main Exam' },
  { subject: 'Chemistry', date: 'Nov 02, 2026', time: '02:00 PM', type: 'Unit Test' },
];

export default function ExamsPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Exams &" 
        titleHighlight="Results" 
      />

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Upcoming Examinations</h2>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Hall Ticket</th>
            </tr>
          </thead>
          <tbody>
            {UPCOMING_EXAMS.map((row, idx) => (
              <tr key={idx}>
                <td className={styles.subjectName}>{row.subject}</td>
                <td>{row.date}</td>
                <td>{row.time}</td>
                <td>{row.type}</td>
                <td>
                  <button className={styles.downloadBtn}>Download</button>
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
