'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Printer, Info } from 'lucide-react';

const TRANSACTIONS = [
  { date: 'Aug 15, 2026', desc: 'Semester 5 Tuition Fee', ref: '#PAY-7721', amount: '₹45,000', status: 'Paid' },
  { date: 'Aug 15, 2026', desc: 'Library & Lab Charges', ref: '#PAY-7722', amount: '₹5,000', status: 'Paid' },
  { date: 'Oct 01, 2026', desc: 'Exam Registration Fee', ref: '#PAY-8140', amount: '₹2,500', status: 'Paid' },
];

export default function FeesPage() {
  const ActionBtn = (
    <button className={styles.actionBtn}>
      <Printer size={16} />
      <span>Download Receipt</span>
    </button>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Fee" 
        titleHighlight="Statement" 
        actionElement={ActionBtn}
      />

      <div className={styles.contentLayout}>
        <section className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Transaction History</h2>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Ref No.</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.desc}</td>
                  <td>{row.ref}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={styles.badge}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Account Summary</h2>
          <div className={styles.summaryLabel}>Total Outstanding</div>
          <div className={styles.summaryValue}>₹0</div>
          <p className={styles.summaryDesc}>
            You are currently in good standing. All fees for Semester 5 are cleared.
          </p>
          <div className={styles.summarySubtext}>
            <Info size={16} />
            <span>Next payment due: Jan 2027</span>
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
