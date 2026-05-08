import React from 'react';
import FacultySidebar from './components/FacultySidebar';
import styles from './layout.module.css';

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutWrapper}>
      <FacultySidebar />
      <div className={styles.mainContent}>
        <div className={styles.pageContainer}>
          {children}
          <footer className={styles.footer}>
            This is a visual preview of the Rivo Faculty Portal.
          </footer>
        </div>
      </div>
    </div>
  );
}
