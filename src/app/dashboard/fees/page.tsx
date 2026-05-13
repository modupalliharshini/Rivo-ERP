'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/client';
import { FileText, CreditCard, Landmark, Banknote, Save, Loader2 } from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: '#TXN-8845', name: 'Emma Thompson', amount: 1200, mode: 'Credit Card', icon: CreditCard, date: 'Oct 24, 2026', status: 'Successful' },
  { id: '#TXN-8844', name: 'Liam Wilson', amount: 850, mode: 'Net Banking', icon: Landmark, date: 'Oct 24, 2026', status: 'Successful' },
  { id: '#TXN-8842', name: 'Maria Garcia', amount: 3400, mode: 'Cash', icon: Banknote, date: 'Oct 23, 2026', status: 'Pending' },
];

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'structure'>('transactions');
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [newTxn, setNewTxn] = useState({
    name: '',
    amount: '',
    mode: 'Cash',
    status: 'Successful'
  });

  const supabase = createClient();

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
      if (profile?.institution_id) {
        setInstitutionId(profile.institution_id);
        
        const { data: structures } = await supabase
          .from('fee_structures')
          .select('*')
          .eq('institution_id', profile.institution_id)
          .order('grade', { ascending: true });
        
        if (structures && structures.length > 0) {
          setFeeStructures(structures);
        } else {
          // Initialize with default grades
          const defaults = [
            { grade: 'Playgroup', institution_id: profile.institution_id, academic_year: '2026–27', reg_fee: 1000, admission_fee: 10000, annual_fee: 5000, uniform_books_fee: 10000, term_1_fee: 43800, term_2_fee: 43800, term_3_fee: 21900 },
            { grade: 'Nursery', institution_id: profile.institution_id, academic_year: '2026–27', reg_fee: 1000, admission_fee: 10000, annual_fee: 5000, uniform_books_fee: 10000, term_1_fee: 45960, term_2_fee: 45960, term_3_fee: 22980 },
            { grade: 'Pre-Primary 1', institution_id: profile.institution_id, academic_year: '2026–27', reg_fee: 1000, admission_fee: 10000, annual_fee: 5000, uniform_books_fee: 10000, term_1_fee: 47880, term_2_fee: 47880, term_3_fee: 23940 },
            { grade: 'Pre-Primary 2', institution_id: profile.institution_id, academic_year: '2026–27', reg_fee: 1000, admission_fee: 10000, annual_fee: 5000, uniform_books_fee: 10000, term_1_fee: 51900, term_2_fee: 51900, term_3_fee: 25950 }
          ];
          setFeeStructures(defaults);
        }
      }
    };
    initializeData();
  }, []);

  const handleUpdateStructure = (index: number, field: string, value: string) => {
    const updated = [...feeStructures];
    updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    setFeeStructures(updated);
  };

  const saveStructures = async () => {
    if (!institutionId) {
      alert('System Error: Institution not identified');
      return;
    }
    setIsSaving(true);
    try {
      // Ensure all records have the institution_id
      const dataToSave = feeStructures.map(fs => ({
        ...fs,
        institution_id: institutionId,
        academic_year: '2026–27'
      }));

      const { error } = await supabase.from('fee_structures').upsert(dataToSave, { 
        onConflict: 'institution_id,academic_year,grade' 
      });
      
      if (error) throw error;
      alert('Fee structures updated successfully!');
    } catch (err: any) {
      alert(`Failed to save: ${err.message || 'Unknown error'}`);
      console.error('Save Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalCollected = transactions
    .filter(t => t.status === 'Successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    let ModeIcon = Banknote;
    if (newTxn.mode === 'Credit Card') ModeIcon = CreditCard;
    if (newTxn.mode === 'Net Banking') ModeIcon = Landmark;

    const transaction = {
      ...newTxn,
      id: `#TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: parseFloat(newTxn.amount),
      icon: ModeIcon,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setTransactions([transaction, ...transactions]);
    setIsModalOpen(false);
    setNewTxn({ name: '', amount: '', mode: 'Cash', status: 'Successful' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Fees &"
        titleHighlight="Finance"
        actionElement={
          <div className={styles.headerActions}>
            <button className={`${styles.tabBtn} ${activeTab === 'transactions' ? styles.activeTab : ''}`} onClick={() => setActiveTab('transactions')}>
              Transactions
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'structure' ? styles.activeTab : ''}`} onClick={() => setActiveTab('structure')}>
              Manage Structure
            </button>
            {activeTab === 'transactions' ? (
              <button className="btn-success" onClick={() => setIsModalOpen(true)}>
                <FileText size={18} /> Collect Fee
              </button>
            ) : (
              <button className="btn-primary" onClick={saveStructures} disabled={isSaving}>
                {isSaving ? <Loader2 className="spin" size={18} /> : <><Save size={18} /> Save Structure</>}
              </button>
            )}
          </div>
        }
      />

      {activeTab === 'transactions' ? (
        <>
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statTitle}>Expected Monthly Revenue</div>
              <div className={styles.statValue}>₹250,000</div>
              <div className={styles.statSub}>Total projected for Oct</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statTitle}>Total Collected</div>
              <div className={styles.statValue}>₹{totalCollected.toLocaleString()}</div>
              <div className={`${styles.statSub} ${styles.statSubGreen}`}>
                {Math.round((totalCollected / 250000) * 100)}% of target reached
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statTitle}>Outstanding Dues</div>
              <div className={styles.statValue}>₹{(250000 - totalCollected).toLocaleString()}</div>
              <div className={`${styles.statSub} ${styles.statSubRed}`}>125 Students pending</div>
            </div>
          </section>

          <section className={`${styles.tableCard} card-shadow`}>
            <h2 className={styles.tableTitle}>Recent Transactions</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Student Name</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const Icon = txn.icon;
                  return (
                    <tr key={txn.id}>
                      <td>{txn.id}</td>
                      <td className={styles.nameCell}>{txn.name}</td>
                      <td>₹{txn.amount.toLocaleString()}</td>
                      <td>
                        <div className={styles.paymentMode}>
                          <Icon size={16} className={styles.modeIcon} /> {txn.mode}
                        </div>
                      </td>
                      <td>{txn.date}</td>
                      <td>
                        <span className={`${styles.badge} ${txn.status === 'Successful' ? styles.badgeSuccess : styles.badgePending}`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <section className={`${styles.tableCard} card-shadow`}>
          <div className={styles.structureHeader}>
            <h2 className={styles.tableTitle}>Grade-wise Fee Configuration (2026-27)</h2>
            <p className={styles.structureHint}>Manage registration, admission, and term-wise dues for each academic level.</p>
          </div>

          <div className={styles.scrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Reg Fee</th>
                  <th>Adm Fee</th>
                  <th>Annual Fee</th>
                  <th>Uniform/Books</th>
                  <th>T1 (June)</th>
                  <th>T2 (Aug)</th>
                  <th>T3 (Nov)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {feeStructures.map((fs, idx) => {
                  const total = Number(fs.reg_fee) + Number(fs.admission_fee) + Number(fs.annual_fee) + 
                                Number(fs.uniform_books_fee) + Number(fs.term_1_fee) + Number(fs.term_2_fee) + Number(fs.term_3_fee);
                  return (
                    <tr key={fs.id}>
                      <td className={styles.gradeCell}>{fs.grade}</td>
                      <td><input type="number" className={styles.structureInput} value={fs.reg_fee} onChange={(e) => handleUpdateStructure(idx, 'reg_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.admission_fee} onChange={(e) => handleUpdateStructure(idx, 'admission_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.annual_fee} onChange={(e) => handleUpdateStructure(idx, 'annual_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.uniform_books_fee} onChange={(e) => handleUpdateStructure(idx, 'uniform_books_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.term_1_fee} onChange={(e) => handleUpdateStructure(idx, 'term_1_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.term_2_fee} onChange={(e) => handleUpdateStructure(idx, 'term_2_fee', e.target.value)} /></td>
                      <td><input type="number" className={styles.structureInput} value={fs.term_3_fee} onChange={(e) => handleUpdateStructure(idx, 'term_3_fee', e.target.value)} /></td>
                      <td className={styles.totalCell}>₹{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Fee Payment">
        <form className="erp-form" onSubmit={handleCollectFee}>
          <div className="erp-form-group">
            <label>Student Name</label>
            <input className="erp-input" type="text" placeholder="Search or Enter student name" required value={newTxn.name} onChange={(e) => setNewTxn({...newTxn, name: e.target.value})} />
          </div>
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Amount (₹)</label>
              <input className="erp-input" type="number" placeholder="e.g. 1500" required value={newTxn.amount} onChange={(e) => setNewTxn({...newTxn, amount: e.target.value})} />
            </div>
            <div className="erp-form-group">
              <label>Payment Mode</label>
              <select className="erp-select" value={newTxn.mode} onChange={(e) => setNewTxn({...newTxn, mode: e.target.value})}>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>
          <div className="erp-form-group">
            <label>Collection Status</label>
            <select className="erp-select" value={newTxn.status} onChange={(e) => setNewTxn({...newTxn, status: e.target.value})}>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="erp-btn-submit">Complete Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
