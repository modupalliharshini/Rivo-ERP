'use client';

import React, { useState, useEffect } from 'react';
import styles from './RecentAdmissions.module.css';
import { createClient } from '@/utils/supabase/client';

interface AdmissionEntry {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  created_at: string;
  status: string;
}

export default function RecentAdmissions() {
  const [admissions, setAdmissions] = useState<AdmissionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchRecentAdmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('institution_id')
        .eq('id', user.id)
        .single();

      if (!profile?.institution_id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, grade, created_at')
        .eq('role', 'student')
        .eq('institution_id', profile.institution_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setAdmissions(data.map(d => ({
          id: d.id,
          first_name: d.first_name,
          last_name: d.last_name,
          grade: d.grade || 'N/A',
          created_at: d.created_at,
          status: 'Approved'
        })));
      }
      setIsLoading(false);
    };

    fetchRecentAdmissions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className={`${styles.container} card-shadow`}>
      <h2 className={styles.title}>Recent Admissions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade/Year</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>Loading recent admissions...</td></tr>
          ) : admissions.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No recent admissions found.</td></tr>
          ) : admissions.map((entry) => (
            <tr key={entry.id}>
              <td style={{ fontWeight: 500 }}>{entry.first_name} {entry.last_name}</td>
              <td>{entry.grade}</td>
              <td>
                <span className={`${styles.badge} ${styles.badgeApproved}`}>
                  {entry.status}
                </span>
              </td>
              <td>{formatDate(entry.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
