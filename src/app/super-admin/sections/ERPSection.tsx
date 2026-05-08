'use client';

import React from 'react';
import { 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  MessageSquare,
  ArrowUpRight 
} from 'lucide-react';
import styles from './Sections.module.css';

const STATS = [
  { 
    label: 'Total Institutions', 
    value: '12', 
    trend: '↑ 2 new this month', 
    trendColor: 'text-success',
    icon: Globe 
  },
  { 
    label: 'Global Revenue', 
    value: '₹12.4M', 
    trend: 'Exceeding Q3 targets', 
    trendColor: 'text-blue',
    icon: TrendingUp 
  },
  { 
    label: 'System Uptime', 
    value: '99.99%', 
    trend: 'Perfect status', 
    trendColor: 'text-success',
    icon: ShieldCheck 
  },
  { 
    label: 'Support Tickets', 
    value: '4', 
    trend: 'All urgent cleared', 
    trendColor: 'text-yellow',
    icon: MessageSquare 
  },
];

const INSTITUTIONS = [
  { name: 'Greenwood High School', admin: 'Principal Smith', status: 'Active', renewal: 'Oct 2027' },
  { name: 'St. Xavier\'s College', admin: 'Dr. David Miller', status: 'Active', renewal: 'Jan 2028' },
  { name: 'Sunshine International', admin: 'Maria Garcia', status: 'Expiring soon', renewal: 'Nov 2026' },
];

export default function ERPSection() {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.statsGrid}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statIconWrapper}>
                  <Icon size={18} />
                </div>
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={`${styles.statTrend} ${stat.trendColor}`}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Institution Performance Overview</h3>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Renewal Date</th>
              </tr>
            </thead>
            <tbody>
              {INSTITUTIONS.map((school) => (
                <tr key={school.name}>
                  <td>{school.name}</td>
                  <td>{school.admin}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[school.status.toLowerCase().replace(' ', '')]}`}>
                      {school.status}
                    </span>
                  </td>
                  <td>{school.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
