'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import CourseCard from '../components/CourseCard';
import styles from './page.module.css';
import Link from 'next/link';
import { RIVO_SUBJECTS } from '../../constants/subjects';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('grade').eq('id', user.id).single();
      if (profile && profile.grade) {
        const subjects = RIVO_SUBJECTS[profile.grade as keyof typeof RIVO_SUBJECTS] || [];
        const formatted = subjects.map((s, i) => ({
          id: i,
          code: `${profile.grade.substring(0, 2).toUpperCase()}${101 + i}`,
          semester: 'Current Session',
          title: s,
          details: 'Standard Module',
          progress: Math.floor(Math.random() * 40) + 20,
          colorTheme: (['blue', 'green', 'lightblue'][i % 3]) as any
        }));
        setCourses(formatted);
      }
      setIsLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Courses" 
      />

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spin" />
        </div>
      ) : (
        <section className={styles.coursesGrid}>
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </section>
      )}

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
