'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import StudentStatCard from './components/StudentStatCard';
import styles from './page.module.css';
import { CheckCircle2, TrendingUp, Clock } from 'lucide-react';

const DASHBOARD_STATS = [
  {
    title: 'Attendance',
    value: '92.5%',
    subtext: 'Good standing',
    subtextColor: 'success' as const,
    subtextIcon: <CheckCircle2 size={16} />
  },
  {
    title: 'Average Grade',
    value: 'A- (3.7)',
    subtext: 'Top 15% of class',
    subtextColor: 'info' as const,
    subtextIcon: <TrendingUp size={16} />
  },
  {
    title: 'Pending Tasks',
    value: '3',
    subtext: '2 due this week',
    subtextColor: 'warning' as const,
    subtextIcon: <Clock size={16} />
  },
  {
    title: 'Fees Balance',
    value: '₹0',
    subtext: 'All cleared',
    subtextColor: 'success' as const,
    subtextIcon: <CheckCircle2 size={16} />
  }
];

const TODAY_SCHEDULE = [
  { time: '09:00 - 10:30', subject: 'Advanced Mathematics', room: 'Room 402', professor: 'Dr. Sarah Wilson' },
  { time: '10:45 - 12:15', subject: 'Quantum Physics', room: 'Lab B', professor: 'Prof. David Chen' },
  { time: '01:30 - 03:00', subject: 'Computer Science', room: 'Tech Hall', professor: 'Ms. Emily Brown' },
];

export default function StudentDashboard() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Student" 
        titleHighlight="Overview" 
      />

      <section className={styles.statsGrid}>
        {DASHBOARD_STATS.map((stat, idx) => (
          <StudentStatCard key={idx} {...stat} />
        ))}
      </section>

      <section className={styles.scheduleSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
          <span className={styles.dateText}>Oct 24, 2026</span>
        </div>
        
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
            {TODAY_SCHEDULE.map((item, idx) => (
              <tr key={idx}>
                <td>{item.time}</td>
                <td>{item.subject}</td>
                <td>{item.room}</td>
                <td>{item.professor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
