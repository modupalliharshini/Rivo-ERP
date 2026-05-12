import React from 'react';
import Sidebar from '../components/Sidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {children}
          <footer className={styles.footer}>
            Powered by <a href="https://pickmyschoolai.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-highlight)', fontWeight: '600'}}>Pick My School Ai</a>
          </footer>
        </div>
      </div>
    </div>
  );
}

