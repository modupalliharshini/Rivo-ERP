'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';
import styles from './Sections.module.css';
import { createClient } from '@/utils/supabase/client';

export default function ERPSection() {
  const [stats, setStats] = useState({
    institutionCount: 0,
    isLoading: true
  });
  const [recentSchools, setRecentSchools] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      // Get count
      const { count } = await supabase
        .from('institutions')
        .select('*', { count: 'exact', head: true });
      
      // Get recent
      const { data } = await supabase
        .from('institutions')
        .select(`
          name, status, plan,
          admin:profiles!institutions_admin_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        institutionCount: count || 0,
        isLoading: false
      });
      setRecentSchools(data || []);
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    { 
      label: 'Total Institutions', 
      value: stats.isLoading ? '...' : stats.institutionCount.toString(), 
      trend: stats.institutionCount > 0 ? '↑ Active Partners' : 'No Partners', 
      trendColor: 'text-success',
      icon: Globe 
    },
    { 
      label: 'Global Revenue', 
      value: '₹12.4M', 
      trend: 'Projected Projection', 
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

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((stat) => {
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
          <h3 className={styles.cardTitle}>Live Institution Performance</h3>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {stats.isLoading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>Loading live data...</td></tr>
              ) : recentSchools.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No records found.</td></tr>
              ) : recentSchools.map((school) => (
                <tr key={school.name}>
                  <td>{school.name}</td>
                  <td>{school.admin ? `${school.admin.first_name} ${school.admin.last_name || ''}` : '—'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[school.status?.toLowerCase() || 'active']}`}>
                      {school.status || 'Active'}
                    </span>
                  </td>
                  <td>{school.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
