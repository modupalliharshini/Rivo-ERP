'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, Star } from 'lucide-react';

const INITIAL_FACULTY = [
  { id: 1, name: 'Dr. Robert Miller', dept: 'Science', title: 'Head of Dept', exp: '15 Years', rating: 4.9, status: 'Present' },
  { id: 2, name: 'Sarah Jenkins', dept: 'Mathematics', title: 'Senior Lecturer', exp: '8 Years', rating: 4.7, status: 'In Session' },
  { id: 3, name: 'Prof. David Green', dept: 'Computer Science', title: 'Professor', exp: '22 Years', rating: 5.0, status: 'On Leave' },
];

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState(INITIAL_FACULTY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    dept: 'Science',
    title: '',
    exp: '',
    status: 'Present'
  });

  const handleHireMember = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedMember = {
      ...newMember,
      id: facultyList.length + 1,
      rating: 5.0, // New hires start with a perfect 5.0
    };
    setFacultyList([joinedMember, ...facultyList]);
    setIsModalOpen(false);
    setNewMember({ name: '', dept: 'Science', title: '', exp: '', status: 'Present' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Faculty"
        titleHighlight="Management"
        actionElement={
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Hire Member
          </button>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <StatCard title="Staff Strength" value={facultyList.length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="On Leave" value={facultyList.filter(f => f.status === 'On Leave').length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="Department Count" value="12" trend="" trendType="neutral" />
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Staff Directory</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Experience</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.map((faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.name}</td>
                <td>{faculty.dept}</td>
                <td>{faculty.title}</td>
                <td>{faculty.exp}</td>
                <td>
                  <span className={styles.rating}>
                    <Star size={16} fill="currentColor" className={styles.star} /> {faculty.rating.toFixed(1)}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      faculty.status === 'Present'
                        ? styles.badgePresent
                        : faculty.status === 'In Session'
                        ? styles.badgeSession
                        : styles.badgeLeave
                    }`}
                  >
                    {faculty.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hire Faculty Member"
      >
        <form className="erp-form" onSubmit={handleHireMember}>
          <div className="erp-form-group">
            <label>Full Name</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Dr. Jane Smith"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Department</label>
              <select
                className="erp-select"
                value={newMember.dept}
                onChange={(e) => setNewMember({...newMember, dept: e.target.value})}
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
            <div className="erp-form-group">
              <label>Designation</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. Professor"
                required
                value={newMember.title}
                onChange={(e) => setNewMember({...newMember, title: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Experience</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. 10 Years"
                required
                value={newMember.exp}
                onChange={(e) => setNewMember({...newMember, exp: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Initial Status</label>
              <select
                className="erp-select"
                value={newMember.status}
                onChange={(e) => setNewMember({...newMember, status: e.target.value})}
              >
                <option value="Present">Present</option>
                <option value="In Session">In Session</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Complete Hiring
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
