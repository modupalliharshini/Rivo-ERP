import React from 'react';
import styles from './FacultyStatCard.module.css';

interface FacultyStatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  subtextColor?: 'success' | 'warning' | 'info' | 'text';
  icon?: React.ReactNode;
}

export default function FacultyStatCard({
  title,
  value,
  subtext,
  subtextColor = 'text',
  icon
}: FacultyStatCardProps) {
  const subtextClass = styles[`subtext${subtextColor.charAt(0).toUpperCase() + subtextColor.slice(1)}`];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.subtext} ${subtextClass}`}>
        {subtext}
      </div>
    </div>
  );
}
