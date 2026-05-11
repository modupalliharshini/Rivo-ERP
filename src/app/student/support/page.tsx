'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setTickets(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleCreateTicket = async () => {
    if (!newSubject.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user's institution_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('institution_id')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        { 
          subject: newSubject, 
          priority: newPriority,
          status: 'Open',
          user_id: user.id,
          institution_id: profile?.institution_id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket: ' + error.message);
      return;
    }

    if (data) {
      setTickets([data, ...tickets]);
      setIsModalOpen(false);
      setNewSubject('');
      setNewPriority('Medium');
    }
  };

  const ActionBtn = (
    <button className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
      + Raise New Ticket
    </button>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Raise" 
        titleHighlight="Ticket" 
        actionElement={ActionBtn}
      />

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>My Support History</h2>
        
        {isLoading ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#64748b'}}>Loading tickets...</div>
        ) : (
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
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                    No tickets found. Raise one above if you need help!
                  </td>
                </tr>
              ) : (
                tickets.map((row) => (
                  <tr key={row.id}>
                    <td style={{fontSize: '0.75rem', color: '#9ca3af'}}>
                      #{row.id.split('-')[0].toUpperCase()}
                    </td>
                    <td>{row.subject}</td>
                    <td>{new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <span className={`${styles.badge} ${row.priority === 'High' || row.priority === 'Urgent' ? styles.badgeRed : styles.badgeBlue}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${row.status === 'Resolved' ? styles.badgeGreen : styles.badgeBlue}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Describe your issue</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="What can we help you with?"
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
