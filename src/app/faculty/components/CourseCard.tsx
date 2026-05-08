import React from 'react';
import styles from './CourseCard.module.css';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  code: string;
  section: string;
  students: number;
  credits: number;
  icon?: React.ReactNode;
}

export default function CourseCard({
  title,
  code,
  section,
  students,
  credits,
  icon
}: CourseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{code} | {section}</p>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <Users size={16} />
          <span>{students} Students</span>
        </div>
        <div className={styles.stat}>
          <GraduationCap size={16} />
          <span>{credits} Credits</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryBtn}>
          View Roster <ArrowRight size={14} />
        </button>
        <button className={styles.secondaryBtn}>
          Syllabus
        </button>
      </div>
    </div>
  );
}
