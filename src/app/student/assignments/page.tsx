'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { createClient } from '../../../utils/supabase/client';
import { Loader2, Send, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function AssignmentsPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'Active' | 'Completed'>('Active');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('grade').eq('id', user.id).single();
    if (!profile) return;

    const { data: assignmentsData } = await supabase
      .from('assignments')
      .select('*, profiles(first_name, last_name), assignment_submissions(*)')
      .eq('grade', profile.grade)
      .order('due_date', { ascending: true });

    if (assignmentsData) {
      const filtered = assignmentsData.filter(a => {
        const submission = a.assignment_submissions.find((s: any) => s.student_id === user.id);
        if (filter === 'Active') return !submission || submission.status === 'pending';
        return submission && (submission.status === 'submitted' || submission.status === 'graded');
      });
      
      setAssignments(filtered.map(a => ({
        ...a,
        mySubmission: a.assignment_submissions.find((s: any) => s.student_id === user.id)
      })));
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('assignment_submissions')
        .upsert({
          assignment_id: selectedAssignment.id,
          student_id: user?.id,
          submission_url: submissionUrl,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsSubmitModalOpen(false);
      setSubmissionUrl('');
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgency = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: 'PAST DUE', theme: 'Red' };
    if (days <= 2) return { label: `DUE IN ${days} DAY${days === 1 ? '' : 'S'}`, theme: 'Red' };
    if (days <= 5) return { label: `DUE IN ${days} DAYS`, theme: 'Yellow' };
    return { label: 'DUE NEXT WEEK', theme: 'Blue' };
  };

  const ToggleElement = (
    <div className={styles.toggleGroup}>
      <button 
        className={`${styles.toggleBtn} ${filter === 'Active' ? styles.active : ''}`}
        onClick={() => setFilter('Active')}
      >
        Active
      </button>
      <button 
        className={`${styles.toggleBtn} ${filter === 'Completed' ? styles.active : ''}`}
        onClick={() => setFilter('Completed')}
      >
        Completed
      </button>
    </div>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Assignments" 
        actionElement={ToggleElement}
      />

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader2 className="spin" size={48} />
          <p>Syncing Academic Tasks...</p>
        </div>
      ) : (
        <section className={styles.assignmentList}>
          {assignments.length > 0 ? assignments.map((a) => {
            const urgency = getUrgency(a.due_date);
            return (
              <div key={a.id} className={`${styles.card} ${styles[`card${urgency.theme}`]}`}>
                <div className={styles.info}>
                  <span className={`${styles.dueText} ${styles[`text${urgency.theme}`]}`}>
                    {urgency.label}
                  </span>
                  <h3 className={styles.title}>{a.title}</h3>
                  <p className={styles.details}>{a.subject} • {a.profiles?.first_name} {a.profiles?.last_name}</p>
                </div>
                {filter === 'Active' ? (
                  <button 
                    className={`${styles.actionBtn} ${styles.btnPrimary}`}
                    onClick={() => { setSelectedAssignment(a); setIsSubmitModalOpen(true); }}
                  >
                    Submit Now
                  </button>
                ) : (
                  <div className={styles.statusIndicator}>
                    <CheckCircle size={20} className={styles.successIcon} />
                    <span>Submitted</span>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><FileText size={48} /></div>
              <h3>No {filter} Assignments</h3>
              <p>Everything is up to date! Check back later for new tasks.</p>
            </div>
          )}
        </section>
      )}

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>

      {isSubmitModalOpen && (
        <div className="erp-modal-overlay">
          <div className="erp-modal">
            <div className={styles.modalHeader}>
              <h2>Submit Assignment</h2>
              <p>{selectedAssignment?.title}</p>
            </div>
            <form onSubmit={handleSubmit} className="erp-form">
              <div className="erp-form-group">
                <label>Submission Link (Google Drive / GitHub / etc.)</label>
                <input 
                  type="url"
                  className="erp-input" 
                  required 
                  value={submissionUrl}
                  onChange={e => setSubmissionUrl(e.target.value)}
                  placeholder="Paste your work link here..."
                />
              </div>
              <div className={styles.modalNote}>
                <AlertTriangle size={16} />
                <span>Make sure the link is accessible to your faculty.</span>
              </div>
              <div className="erp-form-actions">
                <button type="button" className="erp-btn-cancel" onClick={() => setIsSubmitModalOpen(false)}>Cancel</button>
                <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spin" size={16} /> : <><Send size={16} /> Submit Work</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
