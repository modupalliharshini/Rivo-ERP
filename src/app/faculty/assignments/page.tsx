'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus, Search } from 'lucide-react';

const ASSIGNMENTS = [
  { id: 1, name: 'Network Security Lab', course: 'Computer Networks', dueDate: 'Oct 30, 2026', submissions: '24 / 42', status: 'Active' },
  { id: 2, name: 'Database Normalization', course: 'Database Systems', dueDate: 'Oct 28, 2026', submissions: '38 / 44', status: 'Active' },
  { id: 3, name: 'Software Architecture', course: 'Software Engineering', dueDate: 'Oct 20, 2026', submissions: '38 / 38', status: 'Closed' },
];

export default function AssignmentsPage() {
  const [search, setSearch] = useState('');

  const filtered = ASSIGNMENTS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.main}>
      <PageHeader
        titleStart="Manage"
        titleHighlight="Assignments"
        actionElement={
          <button className={styles.createBtn}>
            <Plus size={16} /> Create Assignment
          </button>
        }
      />

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Active Assignments</h2>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search assignments..."
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Assignment Name</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td className={styles.assignmentName}>{a.name}</td>
                <td className={styles.courseCell}>{a.course}</td>
                <td>{a.dueDate}</td>
                <td>{a.submissions}</td>
                <td>
                  <span className={`${styles.badge} ${a.status === 'Active' ? styles.badgeActive : styles.badgeClosed}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <button className={a.status === 'Active' ? styles.reviewBtn : styles.gradesBtn}>
                    {a.status === 'Active' ? 'Review' : 'View Grades'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
