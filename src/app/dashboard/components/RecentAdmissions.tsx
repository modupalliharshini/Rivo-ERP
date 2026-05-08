import React from 'react';
import styles from './RecentAdmissions.module.css';

const MOCK_DATA = [
  {
    id: 1,
    name: 'Alex Johnson',
    grade: 'Grade 10',
    status: 'Approved',
    date: 'Oct 24, 2026',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    grade: 'B.Tech III',
    status: 'Pending',
    date: 'Oct 23, 2026',
  },
  {
    id: 3,
    name: 'Liam Wilson',
    grade: 'Grade 8',
    status: 'Approved',
    date: 'Oct 22, 2026',
  },
];

export default function RecentAdmissions() {
  return (
    <div className={`${styles.container} card-shadow`}>
      <h2 className={styles.title}>Recent Admissions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade/Year</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((entry) => (
            <tr key={entry.id}>
              <td style={{ fontWeight: 500 }}>{entry.name}</td>
              <td>{entry.grade}</td>
              <td>
                <span
                  className={`${styles.badge} ${
                    entry.status === 'Approved' ? styles.badgeApproved : styles.badgePending
                  }`}
                >
                  {entry.status}
                </span>
              </td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
