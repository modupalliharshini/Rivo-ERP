'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import CourseCard from '../components/CourseCard';
import styles from './page.module.css';
import Link from 'next/link';

const COURSES_DATA = [
  {
    id: 'CS301',
    code: 'CS301',
    semester: 'Current Semester',
    title: 'Advanced Data Structures',
    details: 'Dr. Alan Turing • Mon & Wed',
    progress: 65,
    colorTheme: 'blue' as const,
  },
  {
    id: 'PHY202',
    code: 'PHY202',
    semester: 'Current Semester',
    title: 'Quantum Mechanics',
    details: 'Prof. Richard Feynman • Tue & Thu',
    progress: 40,
    colorTheme: 'green' as const,
  },
  {
    id: 'MAT303',
    code: 'MAT303',
    semester: 'Elective',
    title: 'Discrete Mathematics',
    details: 'Dr. Grace Hopper • Fridays',
    progress: 25,
    colorTheme: 'lightblue' as const,
  }
];

export default function MyCoursesPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Courses" 
      />

      <section className={styles.coursesGrid}>
        {COURSES_DATA.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
