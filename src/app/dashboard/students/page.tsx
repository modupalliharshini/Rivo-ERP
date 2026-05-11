'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  grade: string;
  section: string;
  phone: string;
  status?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    studentId: '', // custom id like st123
    password: '',
    grade: '',
    section: '',
    phone: '',
    status: 'Active'
  });

  const supabase = createClient();

  const fetchStudents = async () => {
    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching students:', fetchError);
    } else {
      setStudents(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const idLower = newStudent.studentId.toLowerCase();
      if (!idLower.startsWith('st')) {
        throw new Error('Student ID must start with "st"');
      }

      const emailPayload = idLower.includes('@') ? idLower : `${idLower}@rivo.local`;
      
      // Get current admin's institution
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

      const payload = {
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: emailPayload,
        password: newStudent.password,
        role: 'student',
        institutionId: profile?.institution_id,
        grade: newStudent.grade,
        section: newStudent.section,
        phone: newStudent.phone
      };

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', {
        body: payload
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setIsModalOpen(false);
      setNewStudent({
        firstName: '',
        lastName: '',
        studentId: '',
        password: '',
        grade: '',
        section: '',
        phone: '',
        status: 'Active'
      });
      fetchStudents();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentId = student.email.replace('@rivo.local', '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || studentId.includes(searchQuery.toLowerCase());
  });

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
          <StatCard title="Total Enrolled" value={isLoading ? '...' : students.length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="Active Students" value={isLoading ? '...' : students.length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="New Admissions (Month)" value="0" trend="" trendType="neutral" />
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Student List</h2>
          <input 
            type="text" 
            placeholder="Search students..." 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No students found</td>
              </tr>
            ) : filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.email.replace('@rivo.local', '').toUpperCase()}</td>
                <td className={styles.nameCell}>{student.first_name} {student.last_name}</td>
                <td>{student.grade || '—'}</td>
                <td>{student.section || '—'}</td>
                <td>{student.phone || '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
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
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}
          
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>First Name</label>
              <input
                className="erp-input"
                type="text"
                required
                value={newStudent.firstName}
                onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Last Name</label>
              <input
                className="erp-input"
                type="text"
                required
                value={newStudent.lastName}
                onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Student ID (e.g. st123)</label>
              <input
                className="erp-input"
                type="text"
                required
                autoComplete="off"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Password</label>
              <input
                className="erp-input"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={newStudent.password}
                onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
              />
            </div>
          </div>
          
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Grade / Class</label>
              <input
                className="erp-input"
                type="text"
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
              required
              value={newStudent.phone}
              onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
            />
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="spin" size={16} /> Saving...</> : 'Save Student Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
