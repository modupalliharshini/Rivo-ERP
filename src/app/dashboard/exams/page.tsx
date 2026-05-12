'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, Loader2, Calendar as CalendarIcon, Trash2, Edit2, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

const GRADES = ['Playgroup', 'Nursery', 'Pre-Primary 1', 'Pre-Primary 2'];

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    grade: GRADES[0],
    date: new Date().toISOString().split('T')[0],
    status: 'Upcoming',
    description: ''
  });

  const supabase = createClient();

  const fetchExams = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('institution_id', profile.institution_id)
      .order('date', { ascending: false });

    if (data) setExams(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

    const { error } = await supabase
      .from('exams')
      .insert({
        ...newExam,
        institution_id: profile?.institution_id
      });

    if (error) {
      alert('Failed to create exam');
    } else {
      setIsModalOpen(false);
      setNewExam({ name: '', grade: GRADES[0], date: new Date().toISOString().split('T')[0], status: 'Upcoming', description: '' });
      fetchExams();
    }
    setIsSubmitting(false);
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all results for this exam.')) return;
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) alert('Failed to delete');
    else fetchExams();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('exams').update({ status }).eq('id', id);
    if (error) alert('Failed to update status');
    else fetchExams();
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Exam"
        titleHighlight="Management"
        actionElement={
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Schedule New Exam
          </button>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Upcoming</div>
          <div className={styles.statValue}>{exams.filter(e => e.status === 'Upcoming').length}</div>
          <div className={styles.statSub}>Ready to conduct</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Grading</div>
          <div className={styles.statValue}>{exams.filter(e => e.status === 'Grading').length}</div>
          <div className={styles.statSub}>Processing results</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Completed</div>
          <div className={styles.statValue}>{exams.filter(e => e.status === 'Completed').length}</div>
          <div className={styles.statSub}>History archived</div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Academic Assessments</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Grade</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /> Loading...</td></tr>
            ) : exams.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No exams scheduled yet.</td></tr>
            ) : exams.map((exam) => (
              <tr key={exam.id}>
                <td className={styles.examName}>{exam.name}</td>
                <td className={styles.gradeCell}>{exam.grade}</td>
                <td>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <select 
                    className={`${styles.statusSelect} ${styles[`status${exam.status}`]}`}
                    value={exam.status}
                    onChange={(e) => updateStatus(exam.id, e.target.value)}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Grading">Grading</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <Link href={`/dashboard/exams/${exam.id}`} className={styles.editBtn}>
                      <FileText size={14} /> Mark Entry
                    </Link>
                    <button className={styles.deleteBtn} onClick={() => deleteExam(exam.id)}><Trash2 size={14} /></button>
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
        title="Schedule Assessment"
      >
        <form className="erp-form" onSubmit={handleCreateExam}>
          <div className="erp-form-group">
            <label>Exam Name (e.g. Unit Test 1, Annual Exam)</label>
            <input
              className="erp-input"
              type="text"
              required
              value={newExam.name}
              onChange={(e) => setNewExam({...newExam, name: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Target Grade</label>
              <select
                className="erp-select"
                value={newExam.grade}
                onChange={(e) => setNewExam({...newExam, grade: e.target.value})}
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
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
            <label>Description (Optional)</label>
            <textarea
              className="erp-input"
              rows={3}
              value={newExam.description}
              onChange={(e) => setNewExam({...newExam, description: e.target.value})}
            />
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Publish Exam'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
