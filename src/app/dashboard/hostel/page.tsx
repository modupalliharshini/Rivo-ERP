import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Plus } from 'lucide-react';

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

      <section className={styles.statsGrid}>
        {/* Boys Hostel */}
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Boys Hostel (Block A)</h3>
          <p className={styles.capacityText}>Capacity: 450</p>
          <div className={styles.progressBarContainer}>
            <div className={`${styles.progressBar} ${styles.bgGreen}`} style={{ width: '82%' }}></div>
          </div>
          <p className={styles.statSub}>82% Occupancy (369/450)</p>
        </div>

        {/* Girls Hostel */}
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Girls Hostel (Block B)</h3>
          <p className={styles.capacityText}>Capacity: 350</p>
          <div className={styles.progressBarContainer}>
            <div className={`${styles.progressBar} ${styles.bgCyan}`} style={{ width: '95%' }}></div>
          </div>
          <p className={styles.statSub}>95% Occupancy (332/350)</p>
        </div>

        {/* Maintenance Requests */}
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Maintenance Requests</h3>
          <div className={styles.statValue}>8</div>
          <a href="#" className={styles.viewLink}>View Pending Requests</a>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Recent Room Allotments</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Block</th>
              <th>Room No.</th>
              <th>Allotment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ALLOTMENTS.map((allotment) => (
              <tr key={allotment.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{allotment.name}</td>
                <td>{allotment.block}</td>
                <td>{allotment.room}</td>
                <td>{allotment.date}</td>
                <td>
                  <button className={styles.detailsBtn}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
