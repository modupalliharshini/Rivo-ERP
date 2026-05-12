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
            Powered by <a href="https://pickmyschoolai.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-highlight)', fontWeight: '600'}}>Pick My School Ai</a>
          </footer>
        </div>
      </div>
    </div>
  );
}
