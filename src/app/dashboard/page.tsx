import React from 'react';
import styles from './page.module.css';
import StatCard from './components/StatCard';
import RecentAdmissions from './components/RecentAdmissions';
import PageHeader from '../components/PageHeader';

export default function AdminDashboardPage() {
  return (
    <main>
      <PageHeader titleStart="Admin" titleHighlight="Overview" />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <StatCard
            title="Total Students"
            value="1,248"
            trend="↑ 12% increase"
            trendType="positive"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Fee Collection"
            value="₹42,500"
            trend="85% Target reached"
            trendType="info"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Average Attendance"
            value="94.2%"
            trend="Today's report"
            trendType="warning"
          />
        </div>
        <div className={styles.statWrapper}>
          <StatCard
            title="Active Faculty"
            value="76"
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
