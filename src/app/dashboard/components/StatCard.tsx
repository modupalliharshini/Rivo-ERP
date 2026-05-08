import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'info' | 'warning' | 'neutral';
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, trend, trendType, icon }: StatCardProps) {
  const trendClass =
    trendType === 'positive'
      ? styles.trendPositive
      : trendType === 'info'
      ? styles.trendInfo
      : trendType === 'warning'
      ? styles.trendWarning
      : styles.trendNeutral;

  return (
    <div className={`${styles.card} card-shadow`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.trend} ${trendClass}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {trend}
      </div>
    </div>
  );
}
