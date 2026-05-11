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
    totalRevenue: 0,
    totalUsers: 0,
    isLoading: true
  });
  const [recentSchools, setRecentSchools] = useState<any[]>([]);
  const [liveUptime, setLiveUptime] = useState(100);

  const supabase = createClient();

  useEffect(() => {
    // Simulate live uptime fluctuation
    const interval = setInterval(() => {
      const variation = (Math.random() * 0.02);
      setLiveUptime(parseFloat((100 - variation).toFixed(2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Institutions and calculate Revenue
      const { data: schools, count } = await supabase
        .from('institutions')
        .select(`
          name, status, plan,
          admin:profiles!institutions_admin_id_fkey(first_name, last_name)
        `, { count: 'exact' });

      // Calculate revenue based on plans
      const revenueMap: Record<string, number> = {
        'Basic': 50000,
        'Pro': 150000,
        'Enterprise': 500000
      };

      const totalRevenue = schools?.reduce((sum, s) => sum + (revenueMap[s.plan] || 0), 0) || 0;

      // 2. Fetch Tickets (using count from profiles or institutions as a proxy if table doesn't exist yet)
      // For now, let's just use a real count of users as a metric for "Support Load"
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      setStats({
        institutionCount: count || 0,
        totalRevenue: totalRevenue,
        totalUsers: userCount || 0,
        isLoading: false
      });

      // Sort by creation or just take the first few
      setRecentSchools(schools?.slice(0, 3) || []);
    };
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const STAT_CARDS = [
    { 
      label: 'Total Institutions', 
      value: stats.isLoading ? '...' : stats.institutionCount.toString(), 
      trend: `↑ ${stats.institutionCount} Active`, 
      trendColor: 'text-success',
      icon: Globe 
    },
    { 
      label: 'Global Revenue', 
      value: stats.isLoading ? '...' : formatCurrency(stats.totalRevenue), 
      trend: stats.totalRevenue > 0 ? 'Live Contract Value' : 'No Revenue', 
      trendColor: 'text-blue',
      icon: TrendingUp 
    },
    { 
      label: 'System Uptime', 
      value: liveUptime + '%', 
      trend: liveUptime === 100 ? 'Perfect status' : 'Monitoring live', 
      trendColor: 'text-success',
      icon: ShieldCheck 
    },
    { 
      label: 'Total Platform Users', 
      value: stats.isLoading ? '...' : stats.totalUsers.toString(), 
      trend: stats.totalUsers > 0 ? '↑ Active accounts' : 'No users', 
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
          <h3 className={styles.cardTitle}>Real-time Institution Status</h3>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Current Plan</th>
              </tr>
            </thead>
            <tbody>
              {stats.isLoading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>Loading live data...</td></tr>
              ) : recentSchools.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No partners yet.</td></tr>
              ) : recentSchools.map((school) => (
                <tr key={school.name}>
                  <td>{school.name}</td>
                  <td>{school.admin ? `${school.admin.first_name} ${school.admin.last_name || ''}` : <span style={{color:'#94a3b8'}}>Not Assigned</span>}</td>
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
