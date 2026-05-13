'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus, Notebook, Loader2, Search, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function CounsellingPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    studentName: '',
    rollNo: '',
    date: new Date().toISOString().split('T')[0], 
    topic: '', 
    observation: '', 
    status: 'Completed' 
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Counselling Records for this faculty
    const { data: recordsData } = await supabase
      .from('counselling_records')
      .select(`
        *,
        profiles:student_id (first_name, last_name, roll_no, email)
      `)
      .eq('faculty_id', user.id)
      .order('session_date', { ascending: false });

    if (recordsData) setSessions(recordsData);
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Look up student by Name OR Roll Number
    // First try Roll Number as it's more unique
    let { data: student } = await supabase
      .from('profiles')
      .select('id, institution_id')
      .eq('role', 'student')
      .eq('roll_no', newEntry.rollNo)
      .single();

    if (!student) {
      // Try by name (concatenated)
      const { data: studentsByName } = await supabase
        .from('profiles')
        .select('id, institution_id')
        .eq('role', 'student')
        .ilike('first_name', `%${newEntry.studentName}%`);
      
      if (studentsByName && studentsByName.length > 0) {
        student = studentsByName[0];
      }
    }

    if (!student) {
      alert(`Student with Roll No "${newEntry.rollNo}" or Name "${newEntry.studentName}" not found. Please ensure they are registered in the system.`);
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from('counselling_records').insert({
      faculty_id: user.id,
      institution_id: student.institution_id,
      student_id: student.id,
      topic: newEntry.topic,
      observation: newEntry.observation,
      status: newEntry.status,
      session_date: newEntry.date
    });

    if (!error) {
      await fetchData();
      setShowForm(false);
      setNewEntry({ 
        studentName: '',
        rollNo: '',
        date: new Date().toISOString().split('T')[0], 
        topic: '', 
        observation: '', 
        status: 'Completed' 
      });
    } else {
      alert(error.message);
    }
    setIsSaving(false);
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
              <input 
                className={styles.formInput} 
                required 
                value={newEntry.studentName} 
                onChange={e => setNewEntry({...newEntry, studentName: e.target.value})}
                placeholder="Enter full name..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Roll Number / ID</label>
              <input 
                className={styles.formInput} 
                required 
                value={newEntry.rollNo} 
                onChange={e => setNewEntry({...newEntry, rollNo: e.target.value})}
                placeholder="e.g. st123"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Session Date</label>
              <input type="date" className={styles.formInput} required value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label>Current Status</label>
              <select className={styles.formInput} value={newEntry.status} onChange={e => setNewEntry({...newEntry, status: e.target.value})}>
                <option>Completed</option>
                <option>Follow-up</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Primary Topic</label>
            <input className={styles.formInput} required value={newEntry.topic} onChange={e => setNewEntry({...newEntry, topic: e.target.value})} placeholder="e.g. Performance Review" />
          </div>
          <div className={styles.formGroup}>
            <label>Detailed Observation</label>
            <textarea 
              className={styles.formTextarea} 
              required 
              rows={3}
              value={newEntry.observation} 
              onChange={e => setNewEntry({...newEntry, observation: e.target.value})} 
              placeholder="Record key mentorship observations and action items..." 
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className={styles.saveFormBtn} disabled={isSaving}>
              {isSaving ? <Loader2 className={styles.spin} size={16} /> : 'Save Log Entry'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Mentorship Sessions</h2>
          <button className={styles.refreshBtn} onClick={fetchData} disabled={isLoading}>
            <Loader2 className={isLoading ? styles.spin : ''} size={14} />
            Refresh Records
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className={styles.spin} size={40} color="var(--primary)" />
            <p>Syncing mentorship records...</p>
          </div>
        ) : sessions.length > 0 ? (
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
                  <td className={styles.studentName}>
                    {s.profiles?.first_name} {s.profiles?.last_name}
                  </td>
                  <td>{new Date(s.session_date).toLocaleDateString()}</td>
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
        ) : (
          <div className={styles.emptyState}>
            <Notebook size={48} color="#cbd5e1" />
            <p>No counselling records found. Click "New Entry" to start recording mentorship sessions.</p>
          </div>
        )}
      </div>
    </main>
  );
}
