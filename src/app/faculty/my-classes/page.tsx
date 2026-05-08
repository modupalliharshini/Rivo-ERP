'use client';

import React from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import CourseCard from '../components/CourseCard';
import FacultySchedule from '../components/FacultySchedule';
import { Code, Share2, Database } from 'lucide-react';

const COURSES = [
  {
    title: 'Computer Networks',
    code: 'CS-301',
    section: 'Sec A',
    students: 42,
    credits: 4.0,
    icon: <Code size={24} />
  },
  {
    title: 'Software Engineering',
    code: 'CS-305',
    section: 'Sec B',
    students: 38,
    credits: 3.5,
    icon: <Share2 size={24} />
  },
  {
    title: 'Database Systems',
    code: 'CS-208',
    section: 'Sec A',
    students: 44,
    credits: 4.0,
    icon: <Database size={24} />
  }
];

const WEEKLY_SCHEDULE = [
  { time: '09:00 - 10:30', day: 'Mon', subject: 'Comp Networks', room: 'Lab 302' },
  { time: '09:00 - 10:30', day: 'Wed', subject: 'Comp Networks', room: 'Lab 302' },
  { time: '09:00 - 10:30', day: 'Fri', subject: 'Comp Networks', room: 'Lab 302' },
  { time: '11:00 - 12:30', day: 'Tue', subject: 'Soft Eng', room: 'Room 405' },
  { time: '11:00 - 12:30', day: 'Thu', subject: 'Soft Eng', room: 'Room 405' },
  { time: '02:00 - 03:30', day: 'Mon', subject: 'Databases', room: 'Room 405' },
  { time: '02:00 - 03:30', day: 'Tue', subject: 'Databases', room: 'Room 405' },
  { time: '02:00 - 03:30', day: 'Fri', subject: 'Databases', room: 'Room 405' },
];

export default function MyClassesPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Classes" 
      />

      <section className={styles.coursesGrid}>
        {COURSES.map((course, idx) => (
          <CourseCard key={idx} {...course} />
        ))}
      </section>

      <section className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Weekly Schedule</h2>
        <div className={styles.scheduleWrapper}>
          <FacultySchedule type="weekly" items={WEEKLY_SCHEDULE} />
        </div>
      </section>
    </main>
  );
}
