import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { ChevronRight } from 'lucide-react';

const MOCK_TICKETS = [
  { id: '#T-204', subject: 'Cannot access fees portal', user: 'Alex Johnson', role: 'Student', status: 'Urgent' },
  { id: '#T-198', subject: 'Attendance Sync Issue', user: 'Emma Watson', role: 'Faculty', status: 'In Progress' },
];

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Ticketing"
        titleHighlight="Support"
      />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Open Student Tickets</h3>
          <div className={styles.statValue}>18</div>
          <a href="#" className={`${styles.statSubLink} ${styles.urgentText}`}>
            4 Urgent <ChevronRight size={16} />
          </a>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Open Faculty Tickets</h3>
          <div className={styles.statValue}>5</div>
          <a href="#" className={styles.statSubLink}>
            View All <ChevronRight size={16} />
          </a>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Recent Support Requests</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TICKETS.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ticket.subject}</td>
                <td>{ticket.user}</td>
                <td>{ticket.role}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      ticket.status === 'Urgent' ? styles.badgeUrgent : styles.badgeInProgress
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <a href="#" className={styles.reviewLink}>Review</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
