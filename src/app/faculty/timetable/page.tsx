import React from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';

const SCHEDULE = [
  { time: '09:00 - 10:30', Mon: 'Comp Networks', Tue: '-', Wed: 'Comp Networks', Thu: '-', Fri: 'Lab Session' },
  { time: '11:00 - 12:30', Mon: '-', Tue: 'Software Eng.', Wed: '-', Thu: 'Software Eng.', Fri: '-' },
  { time: '02:00 - 03:30', Mon: 'Databases', Tue: 'Databases', Wed: '-', Thu: '-', Fri: 'Databases' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

const CELL_COLORS: Record<string, string> = {
  'Comp Networks': 'cellBlue',
  'Software Eng.': 'cellGreen',
  'Databases': 'cellYellow',
  'Lab Session': 'cellBlue',
  '-': 'cellEmpty',
};

export default function TimetablePage() {
  return (
    <main className={styles.main}>
      <PageHeader titleStart="My" titleHighlight="Timetables" />

      <div className={styles.tableCard}>
        <h2 className={styles.tableTitle}>Weekly Schedule</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                {DAYS.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map(row => (
                <tr key={row.time}>
                  <td className={styles.timeCell}>{row.time}</td>
                  {DAY_KEYS.map(day => {
                    const val = row[day];
                    return (
                      <td key={day} className={`${styles.cell} ${styles[CELL_COLORS[val]]}`}>
                        {val !== '-' ? val : <span className={styles.dash}>-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
