import React from 'react';
import styles from './CourseCard.module.css';

interface CourseCardProps {
  code: string;
  semester: string;
  title: string;
  details: string;
  colorTheme: 'blue' | 'green' | 'lightblue';
  syllabusUrl?: string | null;
}

export default function CourseCard({
  code,
  semester,
  title,
  details,
  colorTheme,
  syllabusUrl
}: CourseCardProps) {
  const themeClass = styles[`theme${colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)}`];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.codeBadge} ${themeClass}`}>{code}</span>
        <span className={styles.semester}>{semester}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {syllabusUrl ? (
          <a 
            href={syllabusUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.syllabusLink}
          >
            Download Syllabus
          </a>
        ) : (
          <p className={styles.details}>{details}</p>
        )}
      </div>
    </div>
  );
}
