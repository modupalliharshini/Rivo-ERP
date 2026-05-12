'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HostelPage() {
  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Hostel &" 
        titleHighlight="Mess" 
      />

      <div className={styles.comingSoonContainer}>
        <div className={styles.comingSoonIcon}>
          <AlertCircle size={64} color="#f59e0b" />
        </div>
        <h2>Hostel & Mess Portal Coming Soon</h2>
        <p>Your digital campus residence portal is being upgraded. Soon you will be able to check live mess menus, submit room maintenance requests, and communicate with your block warden directly from this dashboard.</p>
        <div className={styles.comingSoonAction}>
          <span className={styles.maintenanceBadge}>
            Migration in Progress
          </span>
        </div>
      </div>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
