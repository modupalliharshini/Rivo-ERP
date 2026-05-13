'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Printer, Info } from 'lucide-react';

export default function FeesPage() {
  const [loading, setLoading] = React.useState(true);
  const [payments, setPayments] = React.useState<any[]>([]);
  const [structure, setStructure] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);

  const supabase = createClient();

  React.useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get student profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      if (profileData) {
        // 2. Get Fee Structure for their grade
        const { data: structureData } = await supabase
          .from('fee_structures')
          .select('*')
          .eq('grade', profileData.grade)
          .eq('institution_id', profileData.institution_id)
          .single();
        setStructure(structureData);

        // 3. Get Payment History
        const { data: paymentData } = await supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', user.id)
          .order('payment_date', { ascending: false });
        setPayments(paymentData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Fee Details...</div>;

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalDue = structure ? (
    Number(structure.reg_fee) + 
    Number(structure.admission_fee) + 
    Number(structure.annual_fee) + 
    Number(structure.uniform_books_fee) + 
    Number(structure.term_1_fee) + 
    Number(structure.term_2_fee) + 
    Number(structure.term_3_fee)
  ) : 0;
  
  const balance = totalDue - totalPaid;

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
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? payments.map((row, idx) => (
                <tr key={idx}>
                  <td>{new Date(row.payment_date).toLocaleDateString()}</td>
                  <td>{row.description || 'Fee Payment'}</td>
                  <td>₹{row.amount.toLocaleString()}</td>
                  <td>{row.payment_mode}</td>
                  <td>
                    <span className={styles.badge}>{row.status}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '2rem', color: '#94a3b8'}}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {structure && (
            <div className={styles.structureInfo}>
              <h3>Curriculum Fee Structure ({structure.grade})</h3>
              <div className={styles.structureGrid}>
                <div className={styles.structureItem}><span>Admission Fee:</span> <strong>₹{structure.admission_fee.toLocaleString()}</strong></div>
                <div className={styles.structureItem}><span>Annual Fee:</span> <strong>₹{structure.annual_fee.toLocaleString()}</strong></div>
                <div className={styles.structureItem}><span>Books & Uniform:</span> <strong>₹{structure.uniform_books_fee.toLocaleString()}</strong></div>
                <div className={styles.structureItem}><span>Term Dues:</span> <strong>₹{(Number(structure.term_1_fee) + Number(structure.term_2_fee) + Number(structure.term_3_fee)).toLocaleString()}</strong></div>
              </div>
            </div>
          )}
        </section>

        <section className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Account Summary</h2>
          <div className={styles.summaryLabel}>Total Outstanding</div>
          <div className={`${styles.summaryValue} ${balance > 0 ? styles.dues : ''}`}>₹{balance.toLocaleString()}</div>
          <p className={styles.summaryDesc}>
            {balance <= 0 
              ? 'You are currently in good standing. All fees for the current session are cleared.' 
              : `A balance of ₹${balance.toLocaleString()} is pending for your account.`}
          </p>
          <div className={styles.summarySubtext}>
            <Info size={16} />
            <span>Academic Year: {structure?.academic_year || '2026-27'}</span>
          </div>
          {balance > 0 && (
            <button className={styles.payBtn}>Pay Now</button>
          )}
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
