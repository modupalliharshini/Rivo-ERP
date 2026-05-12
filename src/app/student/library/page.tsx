'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const BORROWED_BOOKS = [
  { 
    title: 'Clean Code', 
    author: 'Robert C. Martin', 
    issueDate: 'Oct 15, 2026', 
    returnDate: 'Oct 22, 2026', 
    status: 'Return Soon',
    statusClass: 'badgeWarning'
  }
];

export default function LibraryPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Library" 
        titleHighlight="Books" 
      />

      <section className={styles.tableSection}>
        <div className={styles.comingSoonContainer}>
          <div className={styles.comingSoonIcon}>
            <AlertCircle size={64} color="#f59e0b" />
          </div>
          <h2>Digital Library Coming Soon</h2>
          <p>We are currently setting up the digital library for your grade. Soon you will be able to browse available books, request digital copies, and track your borrowed resources directly from this portal.</p>
          <div className={styles.comingSoonAction}>
            <span className={styles.maintenanceBadge}>
              Migration in Progress
            </span>
          </div>
        </div>
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
