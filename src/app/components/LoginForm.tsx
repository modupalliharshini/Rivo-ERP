'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      const id = identifier.toLowerCase().trim();
      if (id.startsWith('sa')) {
        localStorage.setItem('superAdminId', identifier);
        router.push('/super-admin');
      } else if (id.includes('@')) {
        localStorage.setItem('userEmail', identifier);
        router.push('/dashboard');
      } else if (id.startsWith('st')) {
        localStorage.setItem('studentId', identifier);
        router.push('/student');
      } else if (id.startsWith('fac')) {
        localStorage.setItem('facultyId', identifier);
        router.push('/faculty');
      } else {
        setError('invalid email or id');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.inputGroup}>
        <label htmlFor="identifier">Email, Admin ID, Faculty ID or Student ID</label>
        <input
          id="identifier"
          type="text"
          placeholder="SA123 (Super Admin), FAC123 or ST123"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (error) setError('');
          }}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}
