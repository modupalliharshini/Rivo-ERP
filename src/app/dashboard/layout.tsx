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
            This is a visual preview of the Rivo ERP dashboard interface.
          </footer>
        </div>
      </div>
    </div>
  );
}

