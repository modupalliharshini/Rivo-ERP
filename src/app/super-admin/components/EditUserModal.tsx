'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import styles from './Modal.module.css';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  institution_id: string | null;
}

interface InstitutionOption { id: string; name: string; }

interface EditUserModalProps {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'admin',
    password: '',
    institutionId: '',
  });
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        role: user.role,
        password: '',
        institutionId: user.institution_id || '',
      });
      setError('');
      supabase.from('institutions').select('id, name').order('name').then(({ data }) => {
        setInstitutions(data || []);
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const displayId = user.email.endsWith('@rivo.local')
    ? user.email.replace('@rivo.local', '')
    : user.email;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('update-user', {
        body: {
          targetUserId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          password: formData.password || undefined,
          institutionId: formData.institutionId || null,
        },
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit User</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorText}>{error}</div>}

            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</span>
              <span style={{ fontWeight: 700, color: '#1e293b', marginLeft: 'auto' }}>{displayId}</span>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input type="text" name="firstName" className={styles.formInput}
                  value={formData.firstName} onChange={handleChange} autoComplete="off" required />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input type="text" name="lastName" className={styles.formInput}
                  value={formData.lastName} onChange={handleChange} autoComplete="off" />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select name="role" className={styles.formSelect} value={formData.role} onChange={handleChange}>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>New Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                <input type="password" name="password" className={styles.formInput}
                  value={formData.password} onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password" minLength={6} />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Institution</label>
                <select name="institutionId" className={styles.formSelect} value={formData.institutionId} onChange={handleChange}>
                  <option value="">— No Institution —</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
              {isLoading && <Loader2 size={16} className={styles.spin} />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
