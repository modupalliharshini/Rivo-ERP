'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Building2 } from 'lucide-react';
import styles from './Modal.module.css';
import { createClient } from '@/utils/supabase/client';

interface AdminOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AddInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInstitutionModal({ isOpen, onClose, onSuccess }: AddInstitutionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    plan: 'Standard',
    status: 'Active',
    adminId: '',
  });
  const [admins, setAdmins] = useState<AdminOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
      setFormData({ name: '', location: '', plan: 'Standard', status: 'Active', adminId: '' });
      setError('');
    }
  }, [isOpen]);

  const fetchAdmins = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('role', 'admin')
      .is('institution_id', null); // only unassigned admins
    setAdmins(data || []);
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('manage-institution', {
        body: { action: 'create', ...formData, adminId: formData.adminId || null },
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

  const getAdminLabel = (admin: AdminOption) => {
    const name = `${admin.first_name} ${admin.last_name}`.trim();
    const id = admin.email.replace('@rivo.local', '');
    return name ? `${name} (${id})` : id;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Building2 size={18} />
            </div>
            <h2>Add Institution</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Institution Name</label>
                <input type="text" name="name" className={styles.formInput}
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Rivo Early Learning Centre" autoComplete="off" required />
              </div>

              <div className={styles.formGroup}>
                <label>Location (City)</label>
                <input type="text" name="location" className={styles.formInput}
                  value={formData.location} onChange={handleChange}
                  placeholder="e.g. Hyderabad" autoComplete="off" required />
              </div>

              <div className={styles.formGroup}>
                <label>Assign Admin <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                <select name="adminId" className={styles.formSelect} value={formData.adminId} onChange={handleChange}>
                  <option value="">— No Admin Yet —</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>{getAdminLabel(admin)}</option>
                  ))}
                </select>
                {admins.length === 0 && (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Create admin users first via Global Users
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>License Plan</label>
                <select name="plan" className={styles.formSelect} value={formData.plan} onChange={handleChange}>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium AI">Premium AI</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Account Status</label>
                <select name="status" className={styles.formSelect} value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Onboarding">Onboarding</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
              {isLoading && <Loader2 size={16} className={styles.spin} />}
              {isLoading ? 'Saving...' : 'Save Institution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
