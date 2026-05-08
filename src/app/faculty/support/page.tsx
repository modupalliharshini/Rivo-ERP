'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus } from 'lucide-react';

const TICKETS = [
  { id: '#F-102', subject: 'Smart Board in Room 405 Not Working', date: 'Oct 15, 2026', priority: 'Medium', status: 'Resolved' },
];

const PRIORITY_STYLES: Record<string, string> = {
  High: 'priorityHigh',
  Medium: 'priorityMedium',
  Low: 'priorityLow',
};

const STATUS_STYLES: Record<string, string> = {
  Resolved: 'statusResolved',
  Open: 'statusOpen',
  'In Progress': 'statusInProgress',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState(TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'Medium' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `#F-${103 + tickets.length}`;
    setTickets(prev => [...prev, {
      id,
      subject: newTicket.subject,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      priority: newTicket.priority,
      status: 'Open',
    }]);
    setShowForm(false);
    setNewTicket({ subject: '', priority: 'Medium' });
  };

  return (
    <main className={styles.main}>
      <PageHeader
        titleStart="Faculty"
        titleHighlight="Support"
        actionElement={
          <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> New Ticket
          </button>
        }
      />

      {showForm && (
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Subject</label>
            <input
              className={styles.formInput}
              placeholder="Describe the issue..."
              required
              value={newTicket.subject}
              onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Priority</label>
            <select className={styles.formInput} value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Submit Ticket</button>
          </div>
        </form>
      )}

      <div className={styles.tableCard}>
        <h2 className={styles.tableTitle}>Support History</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td className={styles.ticketId}>{t.id}</td>
                <td>{t.subject}</td>
                <td>{t.date}</td>
                <td><span className={`${styles.badge} ${styles[PRIORITY_STYLES[t.priority]]}`}>{t.priority}</span></td>
                <td><span className={`${styles.badge} ${styles[STATUS_STYLES[t.status]]}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
