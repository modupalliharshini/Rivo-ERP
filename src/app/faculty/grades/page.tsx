'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';

const STUDENTS = [
  { rollNo: 'CS-2601', name: 'Alex Johnson', score: 92 },
  { rollNo: 'CS-2602', name: 'Maria Garcia', score: 85 },
  { rollNo: 'CS-2603', name: 'Liam Wilson', score: 78 },
];

function getGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'A', color: '#059669' };
  if (score >= 80) return { label: 'A-', color: '#10b981' };
  if (score >= 70) return { label: 'B+', color: '#d97706' };
  if (score >= 60) return { label: 'B', color: '#f59e0b' };
  return { label: 'C', color: '#dc2626' };
}

export default function GradesPage() {
  const [course, setCourse] = useState('CS-301-A');
  const [assessment, setAssessment] = useState('mid-term');
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(STUDENTS.map(s => [s.rollNo, s.score]))
  );
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const handleSave = (rollNo: string) => {
    setSaved(prev => ({ ...prev, [rollNo]: true }));
    setTimeout(() => setSaved(prev => ({ ...prev, [rollNo]: false })), 2000);
  };

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Student" titleHighlight="Grades" />

      <div className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Course</label>
          <select className={styles.filterSelect} value={course} onChange={e => setCourse(e.target.value)}>
            <option value="CS-301-A">Computer Networks (CS-301) - Sec A</option>
            <option value="CS-305-B">Software Engineering (CS-305) - Sec B</option>
            <option value="CS-208-A">Database Systems (CS-208) - Sec A</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Assessment</label>
          <select className={styles.filterSelect} value={assessment} onChange={e => setAssessment(e.target.value)}>
            <option value="mid-term">Mid-Term Examination</option>
            <option value="final">Final Examination</option>
            <option value="quiz1">Quiz 1</option>
            <option value="assignment">Assignment Grade</option>
          </select>
        </div>
        <button className={styles.viewBtn}>View Gradebook</button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Mid-Term Grades - Sec A</h2>
          <button className={styles.exportBtn}>
            📄 Export CSV
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Score (100)</th>
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map(student => {
              const grade = getGrade(scores[student.rollNo]);
              return (
                <tr key={student.rollNo}>
                  <td>{student.rollNo}</td>
                  <td className={styles.studentName}>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      className={styles.scoreInput}
                      value={scores[student.rollNo]}
                      min={0}
                      max={100}
                      onChange={e => setScores(prev => ({ ...prev, [student.rollNo]: Number(e.target.value) }))}
                    />
                  </td>
                  <td>
                    <span
                      className={styles.gradeBadge}
                      style={{ background: grade.color }}
                    >
                      {grade.label}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleSave(student.rollNo)}
                    >
                      {saved[student.rollNo] ? '✓ Saved' : 'Save'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
