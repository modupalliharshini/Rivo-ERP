'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password: password,
      });

      // Seamless bootstrap for the very first Super Admin
      if (signInError && identifier.trim() === 'rivoearlylearningcentre@gmail.com') {
        const { data: bootstrapData, error: bootstrapError } = await supabase.functions.invoke('create-user', {
          body: {
            email: identifier.trim(),
            password: password,
            role: 'super_admin',
            firstName: 'Super',
            lastName: 'Admin'
          }
        });
        
        if (!bootstrapError) {
          // Retry login after successful bootstrap
          const retry = await supabase.auth.signInWithPassword({
            email: identifier.trim(),
            password: password,
          });
          signInError = retry.error;
        }
      }

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // Fetch profile to redirect correctly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) {
          if (profile.role === 'super_admin') router.push('/super-admin');
          else if (profile.role === 'admin') router.push('/dashboard');
          else if (profile.role === 'faculty') router.push('/faculty');
          else if (profile.role === 'student') router.push('/student');
          else router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.inputGroup}>
        <label htmlFor="identifier">Email</label>
        <input
          id="identifier"
          type="email"
          placeholder="user@example.com"
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
