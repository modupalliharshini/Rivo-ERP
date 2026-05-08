'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { FileText, CreditCard, Landmark, Banknote } from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: '#TXN-8845', name: 'Emma Thompson', amount: 1200, mode: 'Credit Card', icon: CreditCard, date: 'Oct 24, 2026', status: 'Successful' },
  { id: '#TXN-8844', name: 'Liam Wilson', amount: 850, mode: 'Net Banking', icon: Landmark, date: 'Oct 24, 2026', status: 'Successful' },
  { id: '#TXN-8842', name: 'Maria Garcia', amount: 3400, mode: 'Cash', icon: Banknote, date: 'Oct 23, 2026', status: 'Pending' },
];

export default function FeesPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({
    name: '',
    amount: '',
    mode: 'Cash',
    status: 'Successful'
  });

  const totalCollected = transactions
    .filter(t => t.status === 'Successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose icon based on mode
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
          <button className="btn-success" onClick={() => setIsModalOpen(true)}>
            <FileText size={18} /> Collect Fee
          </button>
        }
      />

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
                    <span
                      className={`${styles.badge} ${
                        txn.status === 'Successful' ? styles.badgeSuccess : styles.badgePending
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Fee Payment"
      >
        <form className="erp-form" onSubmit={handleCollectFee}>
          <div className="erp-form-group">
            <label>Student Name</label>
            <input
              className="erp-input"
              type="text"
              placeholder="Search or Enter student name"
              required
              value={newTxn.name}
              onChange={(e) => setNewTxn({...newTxn, name: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Amount (₹)</label>
              <input
                className="erp-input"
                type="number"
                placeholder="e.g. 1500"
                required
                value={newTxn.amount}
                onChange={(e) => setNewTxn({...newTxn, amount: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Payment Mode</label>
              <select
                className="erp-select"
                value={newTxn.mode}
                onChange={(e) => setNewTxn({...newTxn, mode: e.target.value})}
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="erp-form-group">
            <label>Collection Status</label>
            <select
              className="erp-select"
              value={newTxn.status}
              onChange={(e) => setNewTxn({...newTxn, status: e.target.value})}
            >
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Complete Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
