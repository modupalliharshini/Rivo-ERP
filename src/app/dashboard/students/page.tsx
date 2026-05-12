'use client';

import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, MoreVertical, Loader2, Pencil, Trash2 } from 'lucide-react';
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
  created_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
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

    if (fetchError) console.error(fetchError);
    else setStudents(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const idLower = newStudent.studentId.toLowerCase();
      if (!idLower.startsWith('st')) throw new Error('Student ID must start with "st"');

      const emailPayload = idLower.includes('@') ? idLower : `${idLower}@rivo.local`;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', {
        body: {
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          email: emailPayload,
          password: newStudent.password,
          role: 'student',
          institutionId: profile?.institution_id,
          grade: newStudent.grade,
          section: newStudent.section,
          phone: newStudent.phone
        }
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setIsModalOpen(false);
      setNewStudent({ firstName: '', lastName: '', studentId: '', password: '', grade: '', section: '', phone: '', status: 'Active' });
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('update-user', {
        body: {
          targetUserId: editStudent.id,
          firstName: editStudent.first_name,
          lastName: editStudent.last_name,
          grade: editStudent.grade,
          section: editStudent.section,
          phone: editStudent.phone
        }
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setEditStudent(null);
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.first_name}?`)) return;
    try {
      const { error: delErr } = await supabase.functions.invoke('delete-user', {
        body: { targetUserId: student.id }
      });
      if (delErr) throw delErr;
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const sid = student.email.replace('@rivo.local', '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || sid.includes(searchQuery.toLowerCase());
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
          <StatCard 
            title="New Admissions" 
            value={isLoading ? '...' : students.filter(s => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(s.created_at) > thirtyDaysAgo;
            }).length.toString()} 
            trend="Last 30 days" 
            trendType="positive" 
          />
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Student List</h2>
          <input type="text" placeholder="Search students..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.email.replace('@rivo.local', '').toUpperCase()}</td>
                <td className={styles.nameCell}>{student.first_name} {student.last_name}</td>
                <td>{student.grade || '—'}</td>
                <td>{student.section || '—'}</td>
                <td>{student.phone || '—'}</td>
                <td><span className={`${styles.badge} ${styles.badgeActive}`}>Active</span></td>
                <td style={{ position: 'relative' }}>
                  <div ref={openMenuId === student.id ? menuRef : null}>
                    <button className={styles.actionDotBtn} onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === student.id && (
                      <div className={styles.actionMenu}>
                        <button onClick={() => { setEditStudent(student); setOpenMenuId(null); }}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button style={{ color: '#ef4444' }} onClick={() => { handleDeleteStudent(student); setOpenMenuId(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form className="erp-form" onSubmit={handleAddStudent}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className="erp-form-row">
            <div className="erp-form-group"><label>First Name</label><input className="erp-input" type="text" required value={newStudent.firstName} onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})} /></div>
            <div className="erp-form-group"><label>Last Name</label><input className="erp-input" type="text" required value={newStudent.lastName} onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})} /></div>
          </div>
          <div className="erp-form-row">
            <div className="erp-form-group"><label>Student ID (e.g. st123)</label><input className="erp-input" type="text" required autoComplete="off" value={newStudent.studentId} onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})} /></div>
            <div className="erp-form-group"><label>Password</label><input className="erp-input" type="password" required minLength={6} autoComplete="new-password" value={newStudent.password} onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} /></div>
          </div>
          <div className="erp-form-row">
            <div className="erp-form-group"><label>Grade / Class</label><input className="erp-input" type="text" required value={newStudent.grade} onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})} /></div>
            <div className="erp-form-group"><label>Section</label><input className="erp-input" type="text" required value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} /></div>
          </div>
          <div className="erp-form-group"><label>Parent Phone</label><input className="erp-input" type="tel" required value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} /></div>
          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="spin" size={16} /> : 'Save Student'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student Record">
        {editStudent && (
          <form className="erp-form" onSubmit={handleUpdateStudent}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className="erp-form-row">
              <div className="erp-form-group"><label>First Name</label><input className="erp-input" type="text" required value={editStudent.first_name} onChange={(e) => setEditStudent({...editStudent, first_name: e.target.value})} /></div>
              <div className="erp-form-group"><label>Last Name</label><input className="erp-input" type="text" value={editStudent.last_name} onChange={(e) => setEditStudent({...editStudent, last_name: e.target.value})} /></div>
            </div>
            <div className="erp-form-row">
              <div className="erp-form-group"><label>Grade / Class</label><input className="erp-input" type="text" required value={editStudent.grade} onChange={(e) => setEditStudent({...editStudent, grade: e.target.value})} /></div>
              <div className="erp-form-group"><label>Section</label><input className="erp-input" type="text" required value={editStudent.section} onChange={(e) => setEditStudent({...editStudent, section: e.target.value})} /></div>
            </div>
            <div className="erp-form-group"><label>Parent Phone</label><input className="erp-input" type="tel" required value={editStudent.phone} onChange={(e) => setEditStudent({...editStudent, phone: e.target.value})} /></div>
            <div className="erp-form-actions">
              <button type="button" className="erp-btn-cancel" onClick={() => setEditStudent(null)}>Cancel</button>
              <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="spin" size={16} /> : 'Update Student'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
