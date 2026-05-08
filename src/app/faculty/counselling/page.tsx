'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus } from 'lucide-react';

const SESSIONS = [
  { id: 1, student: 'Alex Johnson', date: 'Oct 10, 2026', topic: 'Career Guidance', observation: 'Interested in Cloud Computing', status: 'Completed' },
  { id: 2, student: 'Maria Garcia', date: 'Oct 18, 2026', topic: 'Academic Pressure', observation: 'Needs extra time for assignments', status: 'Follow-up' },
];

export default function CounsellingPage() {
  const [sessions, setSessions] = useState(SESSIONS);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ student: '', date: '', topic: '', observation: '', status: 'Completed' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSessions(prev => [...prev, { id: prev.length + 1, ...newEntry }]);
    setShowForm(false);
    setNewEntry({ student: '', date: '', topic: '', observation: '', status: 'Completed' });
  };

  return (
    <main className={styles.main}>
      <PageHeader
        titleStart="Counselling"
        titleHighlight="Diary"
        actionElement={
          <button className={styles.newBtn} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> New Entry
          </button>
        }
      />

      {showForm && (
        <form className={styles.formCard} onSubmit={handleAdd}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Student Name</label>
              <input className={styles.formInput} required value={newEntry.student} onChange={e => setNewEntry({...newEntry, student: e.target.value})} placeholder="e.g. Alex Johnson" />
            </div>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input type="date" className={styles.formInput} required value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Topic</label>
              <input className={styles.formInput} required value={newEntry.topic} onChange={e => setNewEntry({...newEntry, topic: e.target.value})} placeholder="e.g. Career Guidance" />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select className={styles.formInput} value={newEntry.status} onChange={e => setNewEntry({...newEntry, status: e.target.value})}>
                <option>Completed</option>
                <option>Follow-up</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Observation</label>
            <input className={styles.formInput} required value={newEntry.observation} onChange={e => setNewEntry({...newEntry, observation: e.target.value})} placeholder="Key observation notes..." />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className={styles.saveFormBtn}>Save Entry</button>
          </div>
        </form>
      )}

      <div className={styles.tableCard}>
        <h2 className={styles.tableTitle}>Recent Mentorship Sessions</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Date</th>
              <th>Topic</th>
              <th>Observation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td className={styles.studentName}>{s.student}</td>
                <td>{s.date}</td>
                <td>{s.topic}</td>
                <td className={styles.observation}>{s.observation}</td>
                <td>
                  <span className={`${styles.badge} ${s.status === 'Completed' ? styles.badgeCompleted : s.status === 'Follow-up' ? styles.badgeFollowup : styles.badgePending}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
