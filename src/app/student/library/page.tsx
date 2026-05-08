'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
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
        <h2 className={styles.sectionTitle}>Currently Borrowed</h2>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {BORROWED_BOOKS.map((row, idx) => (
              <tr key={idx}>
                <td>{row.title}</td>
                <td>{row.author}</td>
                <td>{row.issueDate}</td>
                <td>{row.returnDate}</td>
                <td>
                  <span className={`${styles.badge} ${styles[row.statusClass]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
