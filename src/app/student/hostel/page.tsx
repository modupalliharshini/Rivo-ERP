'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

export default function HostelPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Hostel &" 
        titleHighlight="Mess" 
      />

      <div className={styles.cardsLayout}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>My Room Details</h2>
          <p className={styles.cardSubtext}>Block A | Room 201</p>
          <hr className={styles.divider} />
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Roommate:</span>
            <span className={styles.fieldValue}>Kevin Peterson</span>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Today&apos;s Mess Menu</h2>
          <div className={styles.cardSubtext} style={{ opacity: 0 }}>Spacer</div>
          <div className={styles.menuItemRow}>
            <span className={styles.menuLabel}>Breakfast:</span>
            <span className={styles.menuValue}>Puri & Bhaji</span>
          </div>
          <div className={styles.menuItemRow}>
            <span className={styles.menuLabel}>Lunch:</span>
            <span className={styles.menuValue}>Rice, Dal & Paneer</span>
          </div>
        </section>
      </div>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
