'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Alex Johnson');
  const [dob, setDob] = useState('2005-08-15');
  const [isSaved, setIsSaved] = useState(false);
  const [studentId, setStudentId] = useState('STU-10921');

  useEffect(() => {
    const savedName = localStorage.getItem('studentProfileName');
    if (savedName) {
      setFullName(savedName);
    }
    const currentId = localStorage.getItem('studentId');
    if (currentId) {
      setStudentId(currentId.toUpperCase());
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('studentProfileName', fullName);
    setIsSaved(true);
    // Dispatch a custom event so PageHeader can dynamically update
    window.dispatchEvent(new Event('profileUpdated'));
    
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Compute initials
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Profile" 
      />

      <div className={styles.cardsLayout}>
        <section className={styles.card}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>{initials}</div>
            <h2 className={styles.profileName}>{fullName}</h2>
            <p className={styles.profileProgram}>B.Tech CS - Semester 5</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.detailsBlock}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Student ID</span>
              <span className={styles.detailValue}>{studentId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Roll No.</span>
              <span className={styles.detailValue}>45</span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Student Information</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Birth</label>
              <input 
                type="date" 
                className={styles.input} 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save Profile
            </button>
            {isSaved && <span className={styles.saveSuccess}>Profile saved successfully!</span>}
          </div>
        </section>
      </div>
    </main>
  );
}
