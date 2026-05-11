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
            Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" style={{color: '#dc2626', fontWeight: '600'}}>The Patterns Company</a>
          </footer>
        </div>
      </div>
    </div>
  );
}
