'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Calendar, Clock, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LeaveApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [leaveData, setLeaveData] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const supabase = createClient();

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Profile for Balances
    const { data: profileData } = await supabase
      .from('profiles')
      .select('institution_id, sick_leave_balance, casual_leave_balance, earned_leave_balance')
      .eq('id', user.id)
      .single();
    
    setProfile(profileData);

    // Fetch Leaves for History
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('faculty_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) setLeaves(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      alert('Profile data not loaded. Please refresh.');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in');

      const { error } = await supabase.from('leaves').insert({
        faculty_id: user.id,
        institution_id: profile.institution_id,
        type: leaveData.type,
        start_date: leaveData.startDate,
        end_date: leaveData.endDate,
        reason: leaveData.reason
      });

      if (error) {
        console.error('Leave insertion error:', error);
        throw error;
      }
      
      setSubmitted(true);
      fetchData();
    } catch (err: any) {
      console.error('Leave submission caught error:', err);
      alert(`Failed to submit application: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader 
        titleStart="Leave" 
        titleHighlight="Application" 
      />

      <div className={styles.layout}>
        {/* Left: Form */}
        <div className={styles.formCard}>
          {submitted ? (
            <div className={styles.successState}>
              <CheckCircle2 size={64} color="#10b981" />
              <h2>Application Submitted!</h2>
              <p>Your leave request has been sent for approval. You will be notified once it is reviewed.</p>
              <button className="btn-primary" onClick={() => setSubmitted(false)}>Apply Another</button>
            </div>
          ) : (
            <form className="erp-form" onSubmit={handleSubmit}>
              <div className="erp-form-group">
                <label>Leave Type</label>
                <select 
                  className="erp-select"
                  value={leaveData.type}
                  onChange={(e) => setLeaveData({...leaveData, type: e.target.value})}
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Earned Leave</option>
                  <option>Maternity/Paternity Leave</option>
                </select>
              </div>

              <div className="erp-form-row">
                <div className="erp-form-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    className="erp-input" 
                    required 
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({...leaveData, startDate: e.target.value})}
                  />
                </div>
                <div className="erp-form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    className="erp-input" 
                    required 
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({...leaveData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="erp-form-group">
                <label>Reason for Leave</label>
                <textarea 
                  className="erp-input" 
                  rows={4} 
                  required 
                  placeholder="Please provide a brief reason..."
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spin" size={18} /> : <><Send size={18} /> Submit Application</>}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Info & Status */}
        <div className={styles.sideColumn}>
          <div className={styles.balanceCard}>
            <h3>Leave Balance</h3>
            <div className={styles.balanceGrid}>
              <div className={styles.balanceItem}>
                <span className={styles.balNum}>{isLoading ? '...' : (profile?.sick_leave_balance ?? 0)}</span>
                <span className={styles.balLabel}>Sick</span>
              </div>
              <div className={styles.balanceItem}>
                <span className={styles.balNum}>{isLoading ? '...' : (profile?.casual_leave_balance ?? 0)}</span>
                <span className={styles.balLabel}>Casual</span>
              </div>
              <div className={styles.balanceItem}>
                <span className={styles.balNum}>{isLoading ? '...' : (profile?.earned_leave_balance ?? 0)}</span>
                <span className={styles.balLabel}>Earned</span>
              </div>
            </div>
          </div>

          <div className={styles.historyCard}>
            <h3>Recent Requests</h3>
            <div className={styles.historyList}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}><Loader2 className="spin" size={20} /></div>
              ) : leaves.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent requests.</div>
              ) : leaves.map((leave) => (
                <div className={styles.historyItem} key={leave.id}>
                  <div className={styles.histIcon}>
                    {leave.status === 'Approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div className={styles.histInfo}>
                    <span className={styles.histType}>{leave.type}</span>
                    <span className={styles.histDate}>
                      {new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className={
                    leave.status === 'Approved' ? styles.statusApproved : 
                    leave.status === 'Rejected' ? styles.statusRejected : 
                    styles.statusPending
                  }>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
