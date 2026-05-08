'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('Robert');
  const [lastName, setLastName] = useState('Fox');
  const [phone, setPhone] = useState('+91 9876543210');
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className={styles.main}>
      <PageHeader titleStart="My" titleHighlight="Profile" />

      <div className={styles.profileGrid}>
        {/* Left card - identity */}
        <div className={styles.identityCard}>
          <div className={styles.avatar}>RF</div>
          <h2 className={styles.fullName}>{firstName} {lastName}</h2>
          <p className={styles.role}>Senior Faculty – Computer Science</p>
          <div className={styles.metaList}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Employee ID</span>
              <span className={styles.metaValue}>RIVO-FAC-9021</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Email</span>
              <span className={styles.metaValue}>robert.fox@rivo.erp</span>
            </div>
          </div>
        </div>

        {/* Right card - editable details */}
        <div className={styles.detailsCard}>
          <h3 className={styles.detailsTitle}>Personal Details</h3>
          <form className={styles.form} onSubmit={handleUpdate}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input className={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input className={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button type="submit" className={styles.updateBtn}>
              {saved ? '✓ Profile Updated' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
