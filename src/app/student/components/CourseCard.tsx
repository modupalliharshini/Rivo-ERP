import React from 'react';
import styles from './CourseCard.module.css';

interface CourseCardProps {
  code: string;
  semester: string;
  title: string;
  details: string;
  progress: number;
  colorTheme: 'blue' | 'green' | 'lightblue';
}

export default function CourseCard({
  code,
  semester,
  title,
  details,
  progress,
  colorTheme
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
        <p className={styles.details}>{details}</p>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>{progress}%</span>
        </div>
        <div className={styles.progressBarWrapper}>
          <div 
            className={`${styles.progressBarFill} ${themeClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
