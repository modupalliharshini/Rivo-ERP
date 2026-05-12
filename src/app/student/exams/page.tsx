'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Loader2, Calendar as CalendarIcon, Download, Trophy, FileText, ChevronRight } from 'lucide-react';

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('grade, institution_id').eq('id', user.id).single();
      if (!profile) return;

      // Fetch upcoming exams for this grade
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .eq('grade', profile.grade)
        .eq('status', 'Upcoming')
        .order('date', { ascending: true });

      // Fetch results for this student
      const { data: resultData } = await supabase
        .from('results')
        .select('*, exams(name, date)')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (examData) setExams(examData);
      if (resultData) setResults(resultData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Exams...</div>;

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Exams &" titleHighlight="Results" />

      {exams.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <CalendarIcon size={20} />
            <h2 className={styles.sectionTitle}>Upcoming Assessments</h2>
          </div>
          <div className={styles.examGrid}>
            {exams.map(exam => (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examDate}>
                  <span className={styles.month}>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className={styles.day}>{new Date(exam.date).toLocaleDateString('en-US', { day: 'numeric' })}</span>
                </div>
                <div className={styles.examInfo}>
                  <h3 className={styles.examName}>{exam.name}</h3>
                  <p className={styles.examDesc}>{exam.description || 'General assessment for all subjects'}</p>
                </div>
                <div className={styles.examAction}>
                  <span className={styles.upcomingBadge}>Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Trophy size={20} />
          <h2 className={styles.sectionTitle}>My Report Cards</h2>
        </div>
        
        {results.length === 0 ? (
          <div className={styles.empty}>No results published yet.</div>
        ) : (
          <div className={styles.resultList}>
            {results.map((res) => (
              <div key={res.id} className={styles.resultCard}>
                <div className={styles.resultMain}>
                  <FileText className={styles.resultIcon} size={24} />
                  <div className={styles.resultDetails}>
                    <h3 className={styles.resultTitle}>{res.exams.name}</h3>
                    <p className={styles.resultDate}>Completed on {new Date(res.exams.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={styles.marksOverview}>
                  {Object.entries(res.subject_marks).map(([sub, score]: any) => (
                    <div key={sub} className={styles.miniScore}>
                      <span className={styles.miniSub}>{sub}</span>
                      <span className={styles.miniVal}>{score}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.resultFooter}>
                  <div className={styles.totalScore}>
                    Total: <span>{res.total_marks}</span>
                  </div>
                  <button className={styles.downloadBtn} onClick={() => alert('PDF generation coming soon')}>
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
