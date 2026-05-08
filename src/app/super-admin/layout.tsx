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
            Rivo ERP - Super Admin Interface
          </footer>
        </div>
      </div>
    </div>
  );
}
