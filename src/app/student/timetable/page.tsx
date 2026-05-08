'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

export default function TimetablePage() {
  const DateRange = (
    <div className={styles.headerStat}>
      <span className={styles.headerStatLabel}>Semester 5</span>
      <span className={styles.headerStatValue}>Mon, Oct 26 - Fri, Oct 30</span>
    </div>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Weekly" 
        titleHighlight="Schedule" 
        actionElement={DateRange}
      />

      <section className={styles.tableContainer}>
        <table className={styles.timetable}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.timeCol}>09:00 - 10:30</td>
              <td className={`${styles.classCell} ${styles.bgBlue}`}>Advanced DS</td>
              <td className={styles.emptyCell}>-</td>
              <td className={`${styles.classCell} ${styles.bgBlue}`}>Advanced DS</td>
              <td className={styles.emptyCell}>-</td>
              <td className={`${styles.classCell} ${styles.bgLightBlue}`}>Discrete Math</td>
            </tr>
            <tr>
              <td className={styles.timeCol}>10:45 - 12:15</td>
              <td className={styles.emptyCell}>-</td>
              <td className={`${styles.classCell} ${styles.bgGreen}`}>Quantum Mech</td>
              <td className={styles.emptyCell}>-</td>
              <td className={`${styles.classCell} ${styles.bgGreen}`}>Quantum Mech</td>
              <td className={styles.emptyCell}>-</td>
            </tr>
            <tr>
              <td className={styles.timeCol}>12:15 - 01:30</td>
              <td colSpan={5} className={styles.lunchBreak}>Lunch Break</td>
            </tr>
            <tr>
              <td className={styles.timeCol}>01:30 - 03:00</td>
              <td className={`${styles.classCell} ${styles.bgYellow}`}>AI Ethics</td>
              <td className={`${styles.classCell} ${styles.bgLightBlue}`}>Discrete Math</td>
              <td className={styles.emptyCell}>-</td>
              <td className={`${styles.classCell} ${styles.bgYellow}`}>AI Ethics</td>
              <td className={styles.emptyCell}>-</td>
            </tr>
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
