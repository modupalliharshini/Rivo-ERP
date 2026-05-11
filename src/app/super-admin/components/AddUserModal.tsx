'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import styles from './Modal.module.css';
import { createClient } from '@/utils/supabase/client';

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
    role: 'admin'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Require specific prefixes
    const idLower = formData.userId.toLowerCase();
    if (formData.role === 'admin' && !idLower.startsWith('ad')) {
      setError('Admin ID must start with "ad"');
      setIsLoading(false);
      return;
    }
    if (formData.role === 'faculty' && !idLower.startsWith('fa')) {
      setError('Faculty ID must start with "fa"');
      setIsLoading(false);
      return;
    }
    if (formData.role === 'student' && !idLower.startsWith('st')) {
      setError('Student ID must start with "st"');
      setIsLoading(false);
      return;
    }

    try {
      const emailPayload = formData.userId.includes('@') ? formData.userId : `${formData.userId}@rivo.local`;
      const payload = { ...formData, email: emailPayload };

      const { data, error: invokeError } = await supabase.functions.invoke('create-user', {
        body: payload
      });

      if (invokeError) {
        throw invokeError;
      }

      if (data && data.error) {
         throw new Error(data.error);
      }

      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        userId: '',
        password: '',
        role: 'admin'
      });
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
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorText}>{error}</div>}
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  className={styles.formInput} 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  className={styles.formInput} 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>User ID</label>
                <input 
                  type="text" 
                  name="userId"
                  className={styles.formInput} 
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="e.g. ad123, fa456, st789"
                  autoComplete="off"
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  className={styles.formInput} 
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required 
                  minLength={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select 
                  name="role"
                  className={styles.formSelect}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
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
