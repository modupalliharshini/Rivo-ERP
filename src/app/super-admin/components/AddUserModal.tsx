'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import styles from './Modal.module.css';
import { createClient } from '@/utils/supabase/client';

interface InstitutionOption { id: string; name: string; }

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    password: '',
    role: 'admin',
    institutionId: '',
  });
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      setFormData({ firstName: '', lastName: '', userId: '', password: '', role: 'admin', institutionId: '' });
      setError('');
      supabase.from('institutions').select('id, name').order('name').then(({ data }) => {
        setInstitutions(data || []);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const idLower = formData.userId.toLowerCase();
    const prefixes: Record<string, string> = { admin: 'ad', faculty: 'fa', student: 'st' };
    const prefix = prefixes[formData.role];
    if (prefix && !idLower.startsWith(prefix)) {
      setError(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} ID must start with "${prefix}"`);
      setIsLoading(false);
      return;
    }

    try {
      const emailPayload = formData.userId.includes('@') ? formData.userId : `${formData.userId}@rivo.local`;
      const payload = { 
        ...formData, 
        email: emailPayload, 
        institutionId: formData.institutionId || null 
      };

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', { body: payload });
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
          <h2>Create New User</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorText}>{error}</div>}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input type="text" name="firstName" className={styles.formInput}
                  value={formData.firstName} onChange={handleChange} autoComplete="off" required />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input type="text" name="lastName" className={styles.formInput}
                  value={formData.lastName} onChange={handleChange} autoComplete="off" required />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>User ID</label>
                <input type="text" name="userId" className={styles.formInput}
                  value={formData.userId} onChange={handleChange}
                  placeholder="e.g. ad123, fa456, st789"
                  autoComplete="off" required />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input type="password" name="password" className={styles.formInput}
                  value={formData.password} onChange={handleChange}
                  autoComplete="new-password" required minLength={6} />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select name="role" className={styles.formSelect} value={formData.role} onChange={handleChange}>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Institution <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
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
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
