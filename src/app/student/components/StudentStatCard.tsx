import React from 'react';
import styles from './StudentStatCard.module.css';

interface StudentStatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  subtextColor?: 'success' | 'warning' | 'info' | 'text';
  subtextIcon?: React.ReactNode;
}

export default function StudentStatCard({
  title,
  value,
  subtext,
  subtextColor = 'text',
  subtextIcon
}: StudentStatCardProps) {
  const subtextClass = styles[`subtext${subtextColor.charAt(0).toUpperCase() + subtextColor.slice(1)}`];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.subtext} ${subtextClass}`}>
        {subtextIcon && <span className={styles.subtextIcon}>{subtextIcon}</span>}
        {subtext}
      </div>
    </div>
  );
}
