import React from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import styles from '../dashboard/layout.module.css';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardWrapper}>
      <SuperAdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {children}
          <footer className={styles.footer}>
            Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-highlight)', fontWeight: '600'}}>The Patterns Company</a>
          </footer>
        </div>
      </div>
    </div>
  );
}
