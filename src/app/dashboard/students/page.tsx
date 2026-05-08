'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, MoreHorizontal } from 'lucide-react';

const INITIAL_MOCK_STUDENTS = [
  { id: 'ST-4521', name: 'Alex Johnson', grade: 'Grade 10', section: 'B', phone: '+1 (555) 0123', status: 'Active' },
  { id: 'ST-4525', name: 'Maria Garcia', grade: 'B.Tech III', section: 'CS-A', phone: '+1 (555) 0124', status: 'Probation' },
  { id: 'ST-4530', name: 'Liam Wilson', grade: 'Grade 8', section: 'A', phone: '+1 (555) 0125', status: 'Active' },
  { id: 'ST-4532', name: 'Emma Thompson', grade: 'Grade 12', section: 'C', phone: '+1 (555) 0126', status: 'Dropped' },
];

export default function StudentsPage() {
  const [students, setStudents] = useState(INITIAL_MOCK_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    section: '',
    phone: '',
    status: 'Active'
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentWithId = {
      ...newStudent,
      id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setStudents([studentWithId, ...students]);
    setIsModalOpen(false);
    setNewStudent({ name: '', grade: '', section: '', phone: '', status: 'Active' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Student"
        titleHighlight="Directory"
        actionElement={
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Student
          </button>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <StatCard title="Total Enrolled" value={students.length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="Active Students" value={students.filter(s => s.status === 'Active').length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="New Admissions (Month)" value="45" trend="" trendType="neutral" />
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Student List</h2>
          <input type="text" placeholder="Search students..." className={styles.searchInput} />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Parent Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td className={styles.nameCell}>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td>{student.phone}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      student.status === 'Active'
                        ? styles.badgeActive
                        : student.status === 'Probation'
                        ? styles.badgeProbation
                        : styles.badgeDropped
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <MoreHorizontal size={20} className={styles.actionDot} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Student"
      >
        <form className="erp-form" onSubmit={handleAddStudent}>
          <div className="erp-form-group">
            <label>Full Name</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. John Doe"
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
            />
          </div>
          
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Grade / Class</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. Grade 10"
                required
                value={newStudent.grade}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Section</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. A"
                required
                value={newStudent.section}
                onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-group">
            <label>Parent/Guardian Phone</label>
            <input
              className="erp-input"
              type="tel"
              placeholder="+1 (555) 0000"
              required
              value={newStudent.phone}
              onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
            />
          </div>

          <div className="erp-form-group">
            <label>Admission Status</label>
            <select
              className="erp-select"
              value={newStudent.status}
              onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Save Student Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
