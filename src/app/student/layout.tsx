import React from 'react';
import StudentSidebar from './components/StudentSidebar';
import styles from './layout.module.css';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutWrapper}>
      <StudentSidebar />
      <div className={styles.mainContent}>
        <div className={styles.pageContainer}>
          {children}
          <footer className={styles.footer}>
            This is a visual preview of the Rivo Student Portal.
          </footer>
        </div>
      </div>
    </div>
  );
}
