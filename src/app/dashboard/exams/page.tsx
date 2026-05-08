'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus } from 'lucide-react';

const INITIAL_EXAMS = [
  { id: 1, name: 'Unit Test 2', subject: 'Mathematics', date: 'Oct 30, 2026', status: 'Upcoming', actionText: 'Edit' },
  { id: 2, name: 'Mid-Term Finals', subject: 'Physics', date: 'Oct 20, 2026', status: 'Grading', actionText: 'View' },
  { id: 3, name: 'Term 1 Assessment', subject: 'Chemistry', date: 'Mar 15, 2026', status: 'Completed', actionText: 'Report' },
];

export default function ExamsPage() {
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    subject: 'Mathematics',
    date: '',
    status: 'Upcoming'
  });

  const upcomingCount = exams.filter(e => e.status === 'Upcoming').length;

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam = {
      ...newExam,
      id: exams.length + 1,
      date: new Date(newExam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      actionText: 'Edit'
    };
    setExams([exam, ...exams]);
    setIsModalOpen(false);
    setNewExam({ name: '', subject: 'Mathematics', date: '', status: 'Upcoming' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Exam"
        titleHighlight="Section"
        actionElement={
          <button className="btn-info" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create New Exam
          </button>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Upcoming Exams</div>
          <div className={styles.statValue}>{upcomingCount}</div>
          <div className={`${styles.statSub} ${styles.subBlue}`}>
            {upcomingCount > 0 ? `Next: ${exams.find(e => e.status === 'Upcoming')?.name}` : 'No upcoming exams'}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Results Pending</div>
          <div className={styles.statValue}>12</div>
          <div className={`${styles.statSub} ${styles.subYellow}`}>Grading in progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Avg. Pass Rate</div>
          <div className={styles.statValue}>88%</div>
          <div className={`${styles.statSub} ${styles.subGreen}`}>+2% from last term</div>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Recent & Upcoming Exams</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{exam.name}</td>
                <td>{exam.subject}</td>
                <td>{exam.date}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      exam.status === 'Upcoming'
                        ? styles.badgeUpcoming
                        : exam.status === 'Grading'
                        ? styles.badgeGrading
                        : styles.badgeCompleted
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td>
                  <a href="#" className={styles.actionLink}>
                    {exam.actionText}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Exam"
      >
        <form className="erp-form" onSubmit={handleCreateExam}>
          <div className="erp-form-group">
            <label>Exam Title</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Unit Test 3"
              required
              value={newExam.name}
              onChange={(e) => setNewExam({...newExam, name: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Subject</label>
              <select
                className="erp-select"
                value={newExam.subject}
                onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="History">History</option>
              </select>
            </div>
            <div className="erp-form-group">
              <label>Exam Date</label>
              <input
                className="erp-input"
                type="date"
                required
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-group">
            <label>Initial Status</label>
            <select
              className="erp-select"
              value={newExam.status}
              onChange={(e) => setNewExam({...newExam, status: e.target.value})}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Grading">Grading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Publish Exam
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
