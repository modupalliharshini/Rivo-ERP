'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { ChevronRight, Clock, Users, Headphones } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const loadTickets = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      await loadTickets();
    }
    setUpdatingId(null);
  };

  const openCount = tickets.filter(t => t.status !== 'Resolved').length;
  const urgentCount = tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Ticketing"
        titleHighlight="Support"
      />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <h3 className={styles.statTitle}>Total Open Tickets</h3>
            <Clock size={20} color="#3b82f6" />
          </div>
          <div className={styles.statValue}>{openCount}</div>
          <div className={`${styles.statSubLink} ${styles.urgentText}`}>
            {urgentCount} High Priority Requests
          </div>
        </div>
        <div className={styles.statCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <h3 className={styles.statTitle}>Global Resolution</h3>
            <Headphones size={20} color="#22c55e" />
          </div>
          <div className={styles.statValue}>{tickets.filter(t => t.status === 'Resolved').length}</div>
          <div className={styles.statSubLink}>
            Resolved Lifetime
          </div>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Recent Support Requests</h2>
        {isLoading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>Loading support requests...</div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Resolution Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                      No tickets found in the system.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td style={{fontSize: '0.8rem'}}>#{ticket.id.split('-')[0].toUpperCase()}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ticket.subject}</td>
                      <td>
                        <span className={`${styles.badge} ${ticket.priority === 'High' || ticket.priority === 'Urgent' ? styles.badgeUrgent : styles.badgeInProgress}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${ticket.status === 'Resolved' ? styles.badgeResolved : styles.badgeInProgress}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          className={styles.statusSelect}
                          style={{padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', outline: 'none'}}
                          value={ticket.status}
                          disabled={updatingId === ticket.id}
                          onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                        >
                          <option value="Open">Set Open</option>
                          <option value="In Progress">Set In Progress</option>
                          <option value="Resolved">Set Resolved</option>
                        </select>
                      </td>
                      <td style={{fontSize: '0.85rem', color: '#64748b'}}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
