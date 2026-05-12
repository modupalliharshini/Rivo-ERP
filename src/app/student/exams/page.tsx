'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Loader2, Calendar as CalendarIcon, Download, Trophy, FileText, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const generatePDF = (res: any) => {
    const doc = new jsPDF();
    
    // Add Logo
    const img = new Image();
    img.src = '/logo.png';
    
    img.onload = () => {
      // Add logo at top left
      doc.addImage(img, 'PNG', 20, 10, 20, 20);
      
      // Header (Adjusted X to center after logo or keep centered)
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      doc.text('RIVO ELC - ACADEMIC REPORT', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text('Powered by Pick My School Ai', 105, 28, { align: 'center' });
      
      // Horizontal Line
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 35, 190, 35);
      
      // Student & Exam Details
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`Student: ${profile?.first_name} ${profile?.last_name}`, 20, 45);
      doc.text(`ID: ${profile?.email.replace('@rivo.local', '').toUpperCase()}`, 20, 53);
      doc.text(`Grade: ${profile?.grade}`, 20, 61);
      doc.text(`Exam: ${res.exams.name}`, 20, 69);
      doc.text(`Date: ${new Date(res.exams.date).toLocaleDateString()}`, 190, 45, { align: 'right' });
      
      // Table
      const tableData = Object.entries(res.subject_marks).map(([sub, score]) => [sub, score]);
      tableData.push([{ content: 'Grand Total', styles: { fontStyle: 'bold' } }, { content: res.total_marks, styles: { fontStyle: 'bold' } }]);

      autoTable(doc, {
        startY: 75,
        head: [['Subject', 'Marks Obtained']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
        margin: { top: 75 },
      });
      
      // Footer
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('This is an electronically generated report card.', 105, finalY + 20, { align: 'center' });
      
      doc.save(`${profile?.first_name}_${res.exams.name}_Report.pdf`);
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!profileData) return;
      setProfile(profileData);

      // Fetch upcoming exams for this grade
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('institution_id', profileData.institution_id)
        .eq('grade', profileData.grade)
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
                  <button className={styles.downloadBtn} onClick={() => generatePDF(res)}>
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
