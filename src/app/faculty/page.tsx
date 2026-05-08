'use client';

import React from 'react';
import styles from './page.module.css';
import PageHeader from '../components/PageHeader';
import FacultyStatCard from './components/FacultyStatCard';
import FacultySchedule from './components/FacultySchedule';
import { Clock, Users, FileCheck, Landmark } from 'lucide-react';

const DASHBOARD_STATS = [
  {
    title: 'Classes Today',
    value: '4',
    subtext: 'Next at 11:00 AM',
    subtextColor: 'success' as const,
    icon: <Clock size={20} />
  },
  {
    title: 'Total Students',
    value: '124',
    subtext: 'Across 3 sections',
    subtextColor: 'info' as const,
    icon: <Users size={20} />
  },
  {
    title: 'Pending Grades',
    value: '18',
    subtext: 'Needs review',
    subtextColor: 'warning' as const,
    icon: <FileCheck size={20} />
  },
  {
    title: 'Avg. Attendance',
    value: '92%',
    subtext: 'Above threshold',
    subtextColor: 'success' as const,
    icon: <Landmark size={20} />
  }
];

const TODAY_SCHEDULE = [
  { time: '09:00 - 10:30', subject: 'Computer Networks', room: 'Lab 302', action: 'Mark Attendance' },
  { time: '11:00 - 12:30', subject: 'Software Engineering', room: 'Room 405', action: 'Upcoming' },
  { time: '02:00 - 03:30', subject: 'Database Systems', room: 'Room 405', action: 'Upcoming' },
];

const RECENT_SUBMISSIONS = [
  { id: 1, student: 'Alex Johnson', assignment: 'Data Structures Assignment', status: 'New', time: 'Just now', initial: 'AJ', color: '#6366f1' },
  { id: 2, student: 'Maria Garcia', assignment: 'Unit Test 1', status: 'Yesterday', time: 'Yesterday', initial: 'MG', color: '#f59e0b' },
  { id: 3, student: 'Liam Wilson', assignment: 'Research Paper', status: '2 days ago', time: '2 days ago', initial: 'LW', color: '#10b981' },
];

export default function FacultyDashboard() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Faculty" 
        titleHighlight="Portal" 
      />

      <section className={styles.statsGrid}>
        {DASHBOARD_STATS.map((stat, idx) => (
          <FacultyStatCard key={idx} {...stat} />
        ))}
      </section>

      <div className={styles.dashboardContent}>
        <section className={styles.scheduleSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
            <button className={styles.viewBtn}>View Calendar</button>
          </div>
          <FacultySchedule type="daily" items={TODAY_SCHEDULE} />
        </section>

        <aside className={styles.submissionsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Submissions</h2>
          </div>
          <div className={styles.submissionsList}>
            {RECENT_SUBMISSIONS.map((sub) => (
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
            ))}
            <button className={styles.viewAllBtn}>View All Submissions</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
