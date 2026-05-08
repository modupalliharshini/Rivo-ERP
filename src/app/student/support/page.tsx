'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

export default function SupportPage() {
  const [tickets, setTickets] = useState([
    { id: '#T-501', subject: 'Course portal not loading', date: 'Oct 20, 2026', priority: 'Urgent', pClass: 'badgeRed', status: 'In Progress', sClass: 'badgeBlue' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Low');

  const handleCreateTicket = () => {
    if (!newSubject.trim()) return;

    const newId = `#T-${500 + tickets.length + 1}`;
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let pClass = 'badgeBlue';
    if (newPriority === 'Urgent') pClass = 'badgeRed';
    else if (newPriority === 'High') pClass = 'badgeRed';

    const newRow = {
      id: newId,
      subject: newSubject,
      date: formattedDate,
      priority: newPriority,
      pClass,
      status: 'Open',
      sClass: 'badgeBlue'
    };

    setTickets([newRow, ...tickets]);
    setIsModalOpen(false);
    setNewSubject('');
    setNewPriority('Low');
  };

  const ActionBtn = (
    <button className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
      + New Ticket
    </button>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Support" 
        titleHighlight="Tickets" 
        actionElement={ActionBtn}
      />

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>My Tickets</h2>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((row, idx) => (
              <tr key={idx}>
                <td>{row.id}</td>
                <td>{row.subject}</td>
                <td>{row.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[row.pClass]}`}>{row.priority}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[row.sClass]}`}>{row.status}</span>
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Create New Ticket</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Briefly describe the issue..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Priority</label>
              <select 
                className={styles.input}
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.submitBtn}
                onClick={handleCreateTicket}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
