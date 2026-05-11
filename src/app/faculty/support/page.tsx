'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const PRIORITY_STYLES: Record<string, string> = {
  High: 'priorityHigh',
  Medium: 'priorityMedium',
  Low: 'priorityLow',
  Urgent: 'priorityHigh',
};

const STATUS_STYLES: Record<string, string> = {
  Resolved: 'statusResolved',
  Open: 'statusOpen',
  'In Progress': 'statusInProgress',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'Medium' });

  const supabase = createClient();

  useEffect(() => {
    const loadTickets = async () => {
      const { data } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setTickets(data);
      setIsLoading(false);
    };
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim()) return;

    const { data } = await supabase
      .from('tickets')
      .insert([{
        subject: newTicket.subject,
        priority: newTicket.priority,
        status: 'Open'
      }])
      .select()
      .single();

    if (data) {
      setTickets(prev => [data, ...prev]);
      setShowForm(false);
      setNewTicket({ subject: '', priority: 'Medium' });
    }
  };

  return (
    <main className={styles.main}>
      <PageHeader
        titleStart="Raise"
        titleHighlight="Ticket"
        actionElement={
          <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Raise New Ticket
          </button>
        }
      />

      {showForm && (
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>What's the issue?</label>
            <input
              className={styles.formInput}
              placeholder="Describe your technical or administrative issue..."
              required
              value={newTicket.subject}
              onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Priority Level</label>
            <select className={styles.formInput} value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}>
              <option value="Low">Low - Minor Request</option>
              <option value="Medium">Medium - Standard Issue</option>
              <option value="High">High - Urgent Problem</option>
              <option value="Urgent">Critical - Immediate Action Needed</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Submit Ticket</button>
          </div>
        </form>
      )}

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.tableTitle}>Support History</h2>
        </div>
        
        {isLoading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>Loading your support history...</div>
        ) : (
          <div className={styles.tableResponsive}>
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
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                      No support history found.
                    </td>
                  </tr>
                ) : (
                  tickets.map(t => (
                    <tr key={t.id}>
                      <td className={styles.ticketId}>#{t.id.split('-')[0].toUpperCase()}</td>
                      <td>{t.subject}</td>
                      <td>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[PRIORITY_STYLES[t.priority] || 'priorityLow']}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[STATUS_STYLES[t.status] || 'statusOpen']}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
