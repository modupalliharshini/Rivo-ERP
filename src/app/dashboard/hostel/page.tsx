import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Plus, AlertCircle } from 'lucide-react';

const MOCK_ALLOTMENTS = [
  { id: 1, name: 'Kevin Peterson', block: 'Block A', room: 'A-201', date: 'Oct 12, 2026' },
  { id: 2, name: 'Sarah Parker', block: 'Block B', room: 'B-105', date: 'Oct 15, 2026' },
];

export default function HostelPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Hostel"
        titleHighlight="Management"
        actionElement={
          <button className="btn-info">
            <Plus size={18} /> Assign Room
          </button>
        }
      />

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.comingSoonContainer}>
          <div className={styles.comingSoonIcon}>
            <AlertCircle size={64} color="#f59e0b" />
          </div>
          <h2>Hostel Management Coming Soon</h2>
          <p>We are currently developing a dynamic room allotment and maintenance tracking system. Features including real-time occupancy monitoring, warden dashboards, and digital laundry tracking will be enabled in the next release.</p>
          <div className={styles.comingSoonAction}>
            <span className={styles.maintenanceBadge}>
              Feature Under Development
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
