'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

const GRADES_DATA = [
  { subject: 'Advanced Data Structures', attendance: '94%', internal: '45/50', grade: 'A', status: 'Excellent', statusClass: 'badgeExcellent' },
  { subject: 'Quantum Mechanics', attendance: '88%', internal: '38/50', grade: 'B+', status: 'Good', statusClass: 'badgeGood' },
  { subject: 'Discrete Mathematics', attendance: '96%', internal: '42/50', grade: 'A-', status: 'Excellent', statusClass: 'badgeExcellent' },
];

export default function CGPAPage() {
  const GPAStat = (
    <div className={styles.headerStat}>
      <span className={styles.headerStatLabel}>Current GPA</span>
      <span className={styles.headerStatValue}>3.72</span>
    </div>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Academic" 
        titleHighlight="Grades" 
        actionElement={GPAStat}
      />

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Semester 5 Performance</h2>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Attendance</th>
              <th>Internal Marks</th>
              <th>Final Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {GRADES_DATA.map((row, idx) => (
              <tr key={idx}>
                <td className={styles.subjectName}>{row.subject}</td>
                <td>{row.attendance}</td>
                <td>{row.internal}</td>
                <td>{row.grade}</td>
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
