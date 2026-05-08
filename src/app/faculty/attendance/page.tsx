'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';

const STUDENTS = [
  { rollNo: 'CS-2601', name: 'Alex Johnson', prevAttendance: '95%' },
  { rollNo: 'CS-2602', name: 'Maria Garcia', prevAttendance: '88%' },
  { rollNo: 'CS-2603', name: 'Liam Wilson', prevAttendance: '92%' },
];

type Status = 'P' | 'A' | 'L';

export default function AttendancePage() {
  const [course, setCourse] = useState('CS-301');
  const [section, setSection] = useState('Section A');
  const [date, setDate] = useState('2026-10-24');
  const [statuses, setStatuses] = useState<Record<string, Status>>({
    'CS-2601': 'P',
    'CS-2602': 'P',
    'CS-2603': 'P',
  });
  const [submitted, setSubmitted] = useState(false);

  const setAll = (status: Status) => {
    const all: Record<string, Status> = {};
    STUDENTS.forEach(s => { all[s.rollNo] = status; });
    setStatuses(all);
  };

  const toggleStatus = (rollNo: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [rollNo]: status }));
  };

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Mark" titleHighlight="Attendance" />

      <div className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Select course</label>
          <select className={styles.filterSelect} value={course} onChange={e => setCourse(e.target.value)}>
            <option value="CS-301">Computer Networks (CS-301)</option>
            <option value="CS-305">Software Engineering (CS-305)</option>
            <option value="CS-208">Database Systems (CS-208)</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Section</label>
          <select className={styles.filterSelect} value={section} onChange={e => setSection(e.target.value)}>
            <option>Section A</option>
            <option>Section B</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Date</label>
          <input type="date" className={styles.filterInput} value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <button className={styles.loadBtn}>Load List</button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Student Attendance List</h2>
          <div className={styles.bulkActions}>
            <button className={styles.presentAllBtn} onClick={() => setAll('P')}>Mark All Present</button>
            <button className={styles.absentAllBtn} onClick={() => setAll('A')}>Mark All Absent</button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Previous Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map(student => (
              <tr key={student.rollNo}>
                <td>{student.rollNo}</td>
                <td className={styles.studentName}>{student.name}</td>
                <td>{student.prevAttendance}</td>
                <td>
                  <div className={styles.statusGroup}>
                    {(['P', 'A', 'L'] as Status[]).map(s => (
                      <button
                        key={s}
                        onClick={() => toggleStatus(student.rollNo, s)}
                        className={`${styles.statusBtn} ${statuses[student.rollNo] === s ? styles[`status${s}`] : styles.statusInactive}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.submitRow}>
          <button
            className={styles.submitBtn}
            onClick={() => setSubmitted(true)}
          >
            {submitted ? '✓ Attendance Submitted' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </main>
  );
}
