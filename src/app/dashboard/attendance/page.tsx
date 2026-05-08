'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Calendar, Download, Plus } from 'lucide-react';

const INITIAL_ATTENDANCE = [
  { id: 1, class: 'Grade 10 - B', total: 40, present: 38, absent: 2, percent: '95%', status: 'Good' },
  { id: 2, class: 'B.Tech III - CS', total: 60, present: 54, absent: 6, percent: '90%', status: 'Warning' },
  { id: 3, class: 'Grade 8 - A', total: 35, present: 35, absent: 0, percent: '100%', status: 'Excellent' },
];

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState(INITIAL_ATTENDANCE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAtt, setNewAtt] = useState({
    class: '',
    total: '',
    present: '',
    absent: ''
  });

  const totalPresentToday = attendanceRecords.reduce((sum, r) => sum + r.present, 0);
  const totalAbsentToday = attendanceRecords.reduce((sum, r) => sum + r.absent, 0);
  const avgRate = Math.round((totalPresentToday / (totalPresentToday + totalAbsentToday)) * 100);

  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseInt(newAtt.total);
    const present = parseInt(newAtt.present);
    const absent = total - present;
    const percentage = Math.round((present / total) * 100);
    
    let status = 'Good';
    if (percentage >= 95) status = 'Excellent';
    else if (percentage < 90) status = 'Warning';

    const record = {
      id: attendanceRecords.length + 1,
      class: newAtt.class,
      total,
      present,
      absent,
      percent: `${percentage}%`,
      status
    };

    setAttendanceRecords([record, ...attendanceRecords]);
    setIsModalOpen(false);
    setNewAtt({ class: '', total: '', present: '', absent: '' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Live"
        titleHighlight="Attendance"
        actionElement={
          <div className={styles.headerActions}>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Mark Attendance
            </button>
            <div className={styles.datePicker}>
              24-10-2026 <Calendar size={18} />
            </div>
          </div>
        }
      />

      <section className={styles.statsGrid}>
        <div className={`${styles.attCard} card-shadow ${styles.statWrapper}`}>
          <div className={styles.attCardTitle}>Present Today</div>
          <div className={styles.attCardValue}>{totalPresentToday.toLocaleString()}</div>
          <div className={styles.progressBar}>
            <div className={styles.fillGreen} style={{ width: `${avgRate}%` }}></div>
          </div>
        </div>

        <div className={`${styles.attCard} card-shadow ${styles.statWrapper}`}>
          <div className={styles.attCardTitle}>Absentees</div>
          <div className={styles.attCardValue}>{totalAbsentToday.toLocaleString()}</div>
          <div className={styles.actionPill}>{totalAbsentToday > 10 ? 'Action Required' : 'On Track'}</div>
        </div>

        <div className={`${styles.attCard} card-shadow ${styles.statWrapper}`}>
          <div className={styles.attCardTitle}>Late Entry</div>
          <div className={styles.attCardValue}>12</div>
          <div className={styles.progressBar}>
            <div className={styles.fillRedTip}></div>
          </div>
        </div>

        <div className={`${styles.attCard} card-shadow ${styles.statWrapper}`}>
          <div className={styles.attCardTitle}>Today&apos;s Rate</div>
          <div className={styles.attCardValue}>{avgRate}%</div>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Class-wise Report</h2>
          <button className={styles.exportBtn}>
            <Download size={16} /> Export
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Total Students</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((row) => (
              <tr key={row.id}>
                <td>{row.class}</td>
                <td>{row.total}</td>
                <td>{row.present}</td>
                <td>{row.absent}</td>
                <td>{row.percent}</td>
                <td>
                  <div className={styles.statusIndicator}>
                    <span 
                      className={`${styles.dot} ${
                        row.status === 'Warning' ? styles.dotYellow : styles.dotGreen
                      }`} 
                    />
                    <span 
                      className={
                        row.status === 'Warning' ? styles.textYellow : styles.textGreen
                      }
                    >
                      {row.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Class Attendance"
      >
        <form className="erp-form" onSubmit={handleMarkAttendance}>
          <div className="erp-form-group">
            <label>Select Class / Grade</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Grade 10 - B"
              required
              value={newAtt.class}
              onChange={(e) => setNewAtt({...newAtt, class: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Total Strength</label>
              <input
                className="erp-input"
                type="number"
                placeholder="0"
                required
                value={newAtt.total}
                onChange={(e) => setNewAtt({...newAtt, total: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Present Students</label>
              <input
                className="erp-input"
                type="number"
                placeholder="0"
                required
                value={newAtt.present}
                onChange={(e) => setNewAtt({...newAtt, present: e.target.value})}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            * Percentage and status will be calculated automatically.
          </p>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Submit Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
