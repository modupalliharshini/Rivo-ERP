'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, Star, Loader2 } from 'lucide-react';
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
  rating?: number;
}

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    facultyId: '', // custom id like fa123
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

    if (fetchError) {
      console.error('Error fetching faculty:', fetchError);
    } else {
      setFacultyList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleHireMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const idLower = newMember.facultyId.toLowerCase();
      if (!idLower.startsWith('fa')) {
        throw new Error('Faculty ID must start with "fa"');
      }

      const emailPayload = idLower.includes('@') ? idLower : `${idLower}@rivo.local`;
      
      // Get current admin's institution
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

      const payload = {
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: emailPayload,
        password: newMember.password,
        role: 'faculty',
        institutionId: profile?.institution_id,
        specialization: newMember.specialization,
        designation: newMember.designation,
        experience: newMember.experience
      };

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', {
        body: payload
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      setIsModalOpen(false);
      setNewMember({
        firstName: '',
        lastName: '',
        facultyId: '',
        password: '',
        specialization: 'Science',
        designation: '',
        experience: '',
        status: 'Present'
      });
      fetchFaculty();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaculty = facultyList.filter(f => {
    const fullName = `${f.first_name} ${f.last_name}`.toLowerCase();
    const facultyId = f.email.replace('@rivo.local', '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || facultyId.includes(searchQuery.toLowerCase());
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
        <div className={styles.statWrapper}>
          <StatCard title="Staff Strength" value={isLoading ? '...' : facultyList.length.toString()} trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="On Leave" value="0" trend="" trendType="neutral" />
        </div>
        <div className={styles.statWrapper}>
          <StatCard title="Department Count" value="12" trend="" trendType="neutral" />
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Staff Directory</h2>
          <input 
            type="text" 
            placeholder="Search staff..." 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading staff...</td>
              </tr>
            ) : filteredFaculty.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No staff found</td>
              </tr>
            ) : filteredFaculty.map((faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.first_name} {faculty.last_name}</td>
                <td>{faculty.email.replace('@rivo.local', '').toUpperCase()}</td>
                <td>{faculty.specialization}</td>
                <td>{faculty.designation || '—'}</td>
                <td>{faculty.experience || '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgePresent}`}>Present</span>
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
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}
          
          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>First Name</label>
              <input
                className="erp-input"
                type="text"
                required
                value={newMember.firstName}
                onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Last Name</label>
              <input
                className="erp-input"
                type="text"
                required
                value={newMember.lastName}
                onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Faculty ID (e.g. fa123)</label>
              <input
                className="erp-input"
                type="text"
                required
                autoComplete="off"
                value={newMember.facultyId}
                onChange={(e) => setNewMember({...newMember, facultyId: e.target.value})}
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
                value={newMember.password}
                onChange={(e) => setNewMember({...newMember, password: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Department / Specialization</label>
              <select
                className="erp-select"
                value={newMember.specialization}
                onChange={(e) => setNewMember({...newMember, specialization: e.target.value})}
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
                value={newMember.designation}
                onChange={(e) => setNewMember({...newMember, designation: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-group">
            <label>Experience</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. 10 Years"
              required
              value={newMember.experience}
              onChange={(e) => setNewMember({...newMember, experience: e.target.value})}
            />
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="spin" size={16} /> Saving...</> : 'Complete Hiring'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
