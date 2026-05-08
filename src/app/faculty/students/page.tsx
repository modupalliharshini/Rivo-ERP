'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Search } from 'lucide-react';

const STUDENTS = [
  { rollNo: 'CS-2601', name: 'Alex Johnson', course: 'Computer Networks', performance: 'Excellent', attendance: '95%' },
  { rollNo: 'CS-2602', name: 'Maria Garcia', course: 'Software Engineering', performance: 'Good', attendance: '88%' },
  { rollNo: 'CS-2603', name: 'Liam Wilson', course: 'Database Systems', performance: 'Average', attendance: '92%' },
];

const PERF_STYLES: Record<string, string> = {
  Excellent: 'perfExcellent',
  Good: 'perfGood',
  Average: 'perfAverage',
};

export default function MyStudentsPage() {
  const [section, setSection] = useState('All Sections');
  const [search, setSearch] = useState('');

  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.main}>
      <PageHeader titleStart="My" titleHighlight="Students" />

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Student List – All Courses</h2>
          <div className={styles.controls}>
            <select className={styles.sectionSelect} value={section} onChange={e => setSection(e.target.value)}>
              <option>All Sections</option>
              <option>Section A</option>
              <option>Section B</option>
            </select>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search students..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Performance</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.rollNo}>
                <td>{s.rollNo}</td>
                <td className={styles.studentName}>{s.name}</td>
                <td>{s.course}</td>
                <td>
                  <span className={`${styles.perfBadge} ${styles[PERF_STYLES[s.performance]]}`}>
                    {s.performance}
                  </span>
                </td>
                <td>{s.attendance}</td>
                <td>
                  <button className={styles.viewBtn}>View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
