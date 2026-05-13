'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Plus, Search, Loader2, Calendar, BookOpen, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';

export default function AssignmentsPage() {
  const supabase = createClient();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facultyClasses, setFacultyClasses] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classKey: '', // "grade|subject"
    due_date: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchFacultyClasses();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('assignments')
      .select('*, assignment_submissions(count)')
      .eq('faculty_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setAssignments(data);
    }
    setIsLoading(false);
  };

  const fetchFacultyClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('timetables')
      .select('grade, subject')
      .eq('faculty_id', user.id);

    if (data) {
      const unique = Array.from(new Set(data.map(s => `${s.grade}|${s.subject}`)));
      setFacultyClasses(unique.map(u => {
        const [grade, subject] = u.split('|');
        return { grade, subject, key: u };
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();
      
      const [grade, subject] = formData.classKey.split('|');
      const submissionData = {
        institution_id: profile?.institution_id,
        faculty_id: user?.id,
        title: formData.title,
        description: formData.description,
        grade,
        subject,
        due_date: new Date(formData.due_date).toISOString()
      };

      if (editItem) {
        const { error } = await supabase
          .from('assignments')
          .update(submissionData)
          .eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert(submissionData);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditItem(null);
      setFormData({ title: '', description: '', classKey: '', due_date: '' });
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to save assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment? All student submissions for this assignment will also be removed.')) return;
    
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    }
  };

  const openEditModal = (a: any) => {
    const dueDate = new Date(a.due_date);
    // Format for datetime-local input: YYYY-MM-DDTHH:MM
    const tzOffset = dueDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dueDate.getTime() - tzOffset).toISOString().slice(0, 16);

    setEditItem(a);
    setFormData({
      title: a.title,
      description: a.description || '',
      classKey: `${a.grade}|${a.subject}`,
      due_date: localISOTime
    });
    setIsModalOpen(true);
  };

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.main}>
      <PageHeader
        titleStart="Manage"
        titleHighlight="Assignments"
        actionElement={
          <button className="btn-primary" onClick={() => { setEditItem(null); setFormData({ title: '', description: '', classKey: '', due_date: '' }); setIsModalOpen(true); }}>
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

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className="spin" size={32} />
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Assignment Name</th>
                <th>Grade / Subject</th>
                <th>Due Date</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const dueDate = new Date(a.due_date);
                const isClosed = dueDate < new Date();
                const submissionCount = a.assignment_submissions?.[0]?.count || 0;

                return (
                  <tr key={a.id}>
                    <td className={styles.assignmentName}>{a.title}</td>
                    <td className={styles.courseCell}>{a.grade} | {a.subject}</td>
                    <td>{dueDate.toLocaleDateString()}</td>
                    <td>{submissionCount} Submissions</td>
                    <td>
                      <span className={`${styles.badge} ${!isClosed ? styles.badgeActive : styles.badgeClosed}`}>
                        {!isClosed ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button className={!isClosed ? styles.reviewBtn : styles.gradesBtn}>
                          {!isClosed ? 'Review' : 'View Grades'}
                        </button>
                        <button className={styles.editBtn} onClick={() => openEditModal(a)}>
                          <Edit2 size={14} />
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(a.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="erp-modal-overlay">
          <div className="erp-modal">
            <div className={styles.modalHeader}>
              <h2>{editItem ? 'Edit Assignment' : 'Create New Assignment'}</h2>
              <p>{editItem ? 'Update the details of this task' : 'Post a new task for your students'}</p>
            </div>
            <form onSubmit={handleSubmit} className="erp-form">
              <div className="erp-form-group">
                <label>Assignment Title</label>
                <input 
                  className="erp-input" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Network Security Lab 1"
                />
              </div>
              
              <div className="erp-form-row">
                <div className="erp-form-group">
                  <label>Assign to Class</label>
                  <select 
                    className="erp-select" 
                    required
                    value={formData.classKey}
                    onChange={e => setFormData({...formData, classKey: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {facultyClasses.map(c => (
                      <option key={c.key} value={c.key}>{c.grade} - {c.subject}</option>
                    ))}
                  </select>
                </div>
                <div className="erp-form-group">
                  <label>Due Date</label>
                  <input 
                    type="datetime-local" 
                    className="erp-input" 
                    required
                    value={formData.due_date}
                    onChange={e => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="erp-form-group">
                <label>Instructions & Description</label>
                <textarea 
                  className="erp-input" 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed instructions for the students..."
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="erp-btn-cancel" onClick={() => { setIsModalOpen(false); setEditItem(null); }}>Cancel</button>
                <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spin" size={16} /> : (editItem ? 'Save Changes' : 'Post Assignment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
