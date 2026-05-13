'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import CourseCard from '../components/CourseCard';
import FacultySchedule from '../components/FacultySchedule';
import { Code, Share2, Database, BookOpen, FlaskConical, Calculator, Globe } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';

export default function MyClassesPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);

  useEffect(() => {
    fetchClassesData();
  }, []);

  const fetchClassesData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Weekly Schedule
      const { data: scheduleData } = await supabase
        .from('timetables')
        .select('*')
        .eq('faculty_id', user.id);

      if (scheduleData) {
        setWeeklySchedule(scheduleData.map(s => ({
          time: `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`,
          day: s.day_of_week.substring(0, 3),
          subject: s.subject,
          room: s.room || 'N/A'
        })));

        // 2. Derive Unique Courses (Grades + Subjects)
        const uniqueClasses = Array.from(new Set(scheduleData.map(s => `${s.grade}|${s.subject}`)));
        
        const coursesList = await Promise.all(uniqueClasses.map(async (classKey) => {
          const [grade, subject] = classKey.split('|');
          
          // Get student count for this grade
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')
            .eq('grade', grade);

          // Icon Logic
          let Icon = BookOpen;
          if (subject.toLowerCase().includes('science')) Icon = FlaskConical;
          if (subject.toLowerCase().includes('math')) Icon = Calculator;
          if (subject.toLowerCase().includes('code') || subject.toLowerCase().includes('computer')) Icon = Code;
          if (subject.toLowerCase().includes('data')) Icon = Database;
          if (subject.toLowerCase().includes('social') || subject.toLowerCase().includes('world')) Icon = Globe;

          return {
            title: subject,
            code: grade,
            section: 'Standard',
            students: count || 0,
            credits: 4.0, // Mocked for now
            icon: <Icon size={24} />
          };
        }));

        setCourses(coursesList);
      }

    } catch (error) {
      console.error('Error fetching classes data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Classes" 
      />

      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
          <p>Loading Your Classes...</p>
        </div>
      ) : (
        <>
          <section className={styles.coursesGrid}>
            {courses.length > 0 ? courses.map((course, idx) => (
              <CourseCard key={idx} {...course} />
            )) : (
              <div className={styles.emptyState}>No classes assigned yet</div>
            )}
          </section>

          <section className={styles.scheduleSection}>
            <h2 className={styles.sectionTitle}>Weekly Schedule</h2>
            <div className={styles.scheduleWrapper}>
              {weeklySchedule.length > 0 ? (
                <FacultySchedule type="weekly" items={weeklySchedule} />
              ) : (
                <div className={styles.emptyState}>No schedule records found</div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
