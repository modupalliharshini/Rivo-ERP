'use client';

import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, MoreVertical, Loader2, Pencil, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Faculty {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  specialization: string;
  designation: string;
  experience: string;
  status?: string;
}

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<Faculty | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    facultyId: '',
    password: '',
    specialization: 'Science',
    designation: '',
    experience: '',
    status: 'Present'
  });

  const supabase = createClient();

  const fetchFaculty = async () => {
    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'faculty')
      .order('created_at', { ascending: false });

    if (fetchError) console.error(fetchError);
    else setFacultyList(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHireMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const idLower = newMember.facultyId.toLowerCase();
      if (!idLower.startsWith('fa')) throw new Error('Faculty ID must start with "fa"');

      const emailPayload = idLower.includes('@') ? idLower : `${idLower}@rivo.local`;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', {
        body: {
          firstName: newMember.firstName,
          lastName: newMember.lastName,
          email: emailPayload,
          password: newMember.password,
          role: 'faculty',
          institutionId: profile?.institution_id,
          specialization: newMember.specialization,
          designation: newMember.designation,
          experience: newMember.experience
        }
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setIsModalOpen(false);
      setNewMember({ firstName: '', lastName: '', facultyId: '', password: '', specialization: 'Science', designation: '', experience: '', status: 'Present' });
      fetchFaculty();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('update-user', {
        body: {
          targetUserId: editMember.id,
          firstName: editMember.first_name,
          lastName: editMember.last_name,
          specialization: editMember.specialization,
          designation: editMember.designation,
          experience: editMember.experience
        }
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setEditMember(null);
      fetchFaculty();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (faculty: Faculty) => {
    if (!confirm(`Are you sure you want to delete ${faculty.first_name}?`)) return;
    try {
      const { error: delErr } = await supabase.functions.invoke('delete-user', {
        body: { targetUserId: faculty.id }
      });
      if (delErr) throw delErr;
      fetchFaculty();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredFaculty = facultyList.filter(f => {
    const fullName = `${f.first_name} ${f.last_name}`.toLowerCase();
    const sid = f.email.replace('@rivo.local', '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || sid.includes(searchQuery.toLowerCase());
  });

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
        <div className={styles.statWrapper}><StatCard title="Staff Strength" value={isLoading ? '...' : facultyList.length.toString()} trend="" trendType="neutral" /></div>
        <div className={styles.statWrapper}><StatCard title="On Leave" value="0" trend="" trendType="neutral" /></div>
        <div className={styles.statWrapper}><StatCard title="Department Count" value="12" trend="" trendType="neutral" /></div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Staff Directory</h2>
          <input type="text" placeholder="Search staff..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Staff ID</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : filteredFaculty.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No staff found</td></tr>
            ) : filteredFaculty.map((faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.first_name} {faculty.last_name}</td>
                <td>{faculty.email.replace('@rivo.local', '').toUpperCase()}</td>
                <td>{faculty.specialization}</td>
                <td>{faculty.designation || '—'}</td>
                <td>{faculty.experience || '—'}</td>
                <td><span className={`${styles.badge} ${styles.badgePresent}`}>Present</span></td>
                <td style={{ position: 'relative' }}>
                  <div ref={openMenuId === faculty.id ? menuRef : null}>
                    <button className={styles.actionDotBtn} onClick={() => setOpenMenuId(openMenuId === faculty.id ? null : faculty.id)}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === faculty.id && (
                      <div className={styles.actionMenu}>
                        <button onClick={() => { setEditMember(faculty); setOpenMenuId(null); }}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button style={{ color: '#ef4444' }} onClick={() => { handleDeleteMember(faculty); setOpenMenuId(null); }}>
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

      {/* Hire Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Hire Faculty Member">
        <form className="erp-form" onSubmit={handleHireMember}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className="erp-form-row">
            <div className="erp-form-group"><label>First Name</label><input className="erp-input" type="text" required value={newMember.firstName} onChange={(e) => setNewMember({...newMember, firstName: e.target.value})} /></div>
            <div className="erp-form-group"><label>Last Name</label><input className="erp-input" type="text" required value={newMember.lastName} onChange={(e) => setNewMember({...newMember, lastName: e.target.value})} /></div>
          </div>
          <div className="erp-form-row">
            <div className="erp-form-group"><label>Faculty ID (e.g. fa123)</label><input className="erp-input" type="text" required autoComplete="off" value={newMember.facultyId} onChange={(e) => setNewMember({...newMember, facultyId: e.target.value})} /></div>
            <div className="erp-form-group"><label>Password</label><input className="erp-input" type="password" required minLength={6} autoComplete="new-password" value={newMember.password} onChange={(e) => setNewMember({...newMember, password: e.target.value})} /></div>
          </div>
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Department</label>
              <select className="erp-select" value={newMember.specialization} onChange={(e) => setNewMember({...newMember, specialization: e.target.value})}>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
            <div className="erp-form-group"><label>Designation</label><input className="erp-input" type="text" required value={newMember.designation} onChange={(e) => setNewMember({...newMember, designation: e.target.value})} /></div>
          </div>
          <div className="erp-form-group"><label>Experience</label><input className="erp-input" type="text" required value={newMember.experience} onChange={(e) => setNewMember({...newMember, experience: e.target.value})} /></div>
          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="spin" size={16} /> : 'Complete Hiring'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editMember} onClose={() => setEditMember(null)} title="Update Staff Record">
        {editMember && (
          <form className="erp-form" onSubmit={handleUpdateMember}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className="erp-form-row">
              <div className="erp-form-group"><label>First Name</label><input className="erp-input" type="text" required value={editMember.first_name} onChange={(e) => setEditMember({...editMember, first_name: e.target.value})} /></div>
              <div className="erp-form-group"><label>Last Name</label><input className="erp-input" type="text" value={editMember.last_name} onChange={(e) => setEditMember({...editMember, last_name: e.target.value})} /></div>
            </div>
            <div className="erp-form-row">
              <div className="erp-form-group">
                <label>Department</label>
                <select className="erp-select" value={editMember.specialization} onChange={(e) => setEditMember({...editMember, specialization: e.target.value})}>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
              <div className="erp-form-group"><label>Designation</label><input className="erp-input" type="text" required value={editMember.designation} onChange={(e) => setEditMember({...editMember, designation: e.target.value})} /></div>
            </div>
            <div className="erp-form-group"><label>Experience</label><input className="erp-input" type="text" required value={editMember.experience} onChange={(e) => setEditMember({...editMember, experience: e.target.value})} /></div>
            <div className="erp-form-actions">
              <button type="button" className="erp-btn-cancel" onClick={() => setEditMember(null)}>Cancel</button>
              <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="spin" size={16} /> : 'Update Staff'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
