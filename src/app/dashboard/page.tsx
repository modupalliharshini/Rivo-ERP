'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import StatCard from './components/StatCard';
import RecentAdmissions from './components/RecentAdmissions';
import PageHeader from '../components/PageHeader';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    isLoading: true
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('institution_id')
        .eq('id', user.id)
        .single();

      if (!profile?.institution_id) return;

      // Count Students
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .eq('institution_id', profile.institution_id);

      // Count Faculty
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'faculty')
        .eq('institution_id', profile.institution_id);

      setStats({
        totalStudents: studentCount || 0,
        totalFaculty: facultyCount || 0,
        isLoading: false
      });
    };

    fetchStats();
  }, []);

  return (
    <main>
      <PageHeader 
        titleStart="Admin" 
        titleHighlight="Overview" 
        actionElement={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => window.location.href='/dashboard/students'}>
              + Add Student
            </button>
            <button className="btn-primary" style={{ background: '#6366f1' }} onClick={() => window.location.href='/dashboard/faculty'}>
              + Hire Faculty
            </button>
          </div>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <StatCard
            title="Total Students"
            value={stats.isLoading ? '...' : stats.totalStudents.toLocaleString()}
            trend={stats.totalStudents > 0 ? "Real-time sync" : "No records"}
            trendType="positive"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Fee Collection"
            value="₹42,500"
            trend="Static Placeholder"
            trendType="info"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Average Attendance"
            value="94.2%"
            trend="Static Placeholder"
            trendType="warning"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Active Faculty"
            value={stats.isLoading ? '...' : stats.totalFaculty.toLocaleString()}
            trend="Full Strength"
            trendType="neutral"
          />
        </div>
      </section>

      <div className={styles.listWrapper}>
        <RecentAdmissions />
      </div>
    </main>
  );
}
