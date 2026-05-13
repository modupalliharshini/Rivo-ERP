'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../../components/PageHeader';
import styles from './page.module.css';
import { Loader2, Save, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const GRADE_SUBJECTS: Record<string, string[]> = {
  'Playgroup': [
    'Literacy Book Team 1', 'Literacy Book Team 2', 'Picture Dictionary', 
    'Environmental Science', 'Rhymes', 'Premath Skills Team 1', 'Premath Skills Team 2'
  ],
  'Nursery': [
    'Math Concepts & Writing Team 1', 'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3',
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2', 
    'Environmental Science & Literacy Team 3', 'Practice & Activity Sheets', 'Rhymes', 
    'Drawing & Coloring', 'Patterns Book'
  ],
  'Pre-Primary 1': [
    'Drawing & Colouring', 'Practice & Activity Sheets', 'Math Concepts & Writing Team 1',
    'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3', 
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2',
    'Environmental Science & Literacy Team 3', 'Rhymes, Stories & Reading', 'Hindi Concepts & Writing'
  ],
  'Pre-Primary 2': [
    'Rhymes, Stories & Reading', 'Drawing & Colouring', 'Practice & Activity Sheets',
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2',
    'Environmental Science & Literacy Team 3', 'Math Concepts & Writing Team 1',
    'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3',
    'Hindi Concepts & Writing Team 1', 'Hindi Concepts & Writing Team 2'
  ]
};

export default function ExamGradingPage() {
  const params = useParams();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, any>>({}); // { studentId: { Math: 80, English: 70 } }
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'English', 'Science']);
  const [newSubject, setNewSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Exam
      const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single();
      if (!examData) return;
      setExam(examData);
      
      // Load subjects from exam record
      if (examData.subjects && examData.subjects.length > 0) {
        setSubjects(examData.subjects);
      } else {
        // Fallback to curriculum-specific defaults based on grade
        const defaultSubjects = GRADE_SUBJECTS[examData.grade] || ['Mathematics', 'English', 'Science'];
        setSubjects(defaultSubjects);
      }

      // Fetch Students in that grade
      const { data: studentData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('institution_id', examData.institution_id)
        .eq('role', 'student')
        .eq('grade', examData.grade)
        .order('first_name', { ascending: true });
      
      if (studentData) setStudents(studentData);

      // Fetch existing results
      const { data: resultData } = await supabase
        .from('results')
        .select('*')
        .eq('exam_id', examId);
      
      if (resultData) {
        const initialMarks: Record<string, any> = {};
        resultData.forEach(r => {
          initialMarks[r.student_id] = r.subject_marks;
        });
        setMarks(initialMarks);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [examId]);

  const handleMarkChange = (studentId: string, subject: string, value: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: value
      }
    }));
  };

  const addSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const removeSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const saveResults = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

    try {
      // Update Exam Subjects
      await supabase.from('exams').update({ subjects: subjects }).eq('id', examId);

      const records = students.map(s => {
        const studentMarks = marks[s.id] || {};
        const total = Object.values(studentMarks).reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
        
        return {
          institution_id: profile?.institution_id,
          exam_id: examId,
          student_id: s.id,
          subject_marks: studentMarks,
          total_marks: total,
          remarks: ''
        };
      });

      const { error } = await supabase
        .from('results')
        .upsert(records, { onConflict: 'exam_id, student_id' });

      if (error) throw error;
      alert('Results and subjects saved successfully!');
    } catch (err) {
      alert('Failed to save results');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Grading Sheet...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <Link href="/dashboard/exams" className={styles.backLink}><ArrowLeft size={16} /> Back to Exams</Link>
      </div>

      <PageHeader 
        titleStart={exam?.name} 
        titleHighlight="Results Entry" 
        actionElement={
          <button className="btn-primary" onClick={saveResults} disabled={isSaving}>
            {isSaving ? <Loader2 className="spin" size={18} /> : <><Save size={18} /> Save All Results</>}
          </button>
        }
      />

      <div className={styles.setupCard}>
        <h3 className={styles.cardTitle}>Manage Subjects for this Exam</h3>
        <div className={styles.subjectTags}>
          {subjects.map(s => (
            <span key={s} className={styles.tag}>
              {s} <button onClick={() => removeSubject(s)}><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className={styles.addSubjectRow}>
          <input 
            className="erp-input" 
            placeholder="Add subject (e.g. Hindi)" 
            value={newSubject} 
            onChange={e => setNewSubject(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addSubject()}
          />
          <button className={styles.addBtn} onClick={addSubject}><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>Student Name</th>
              {subjects.map(s => <th key={s}>{s}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const studentMarks = marks[student.id] || {};
              const total = Object.values(studentMarks).reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
              
              return (
                <tr key={student.id}>
                  <td className={styles.stickyCol}>
                    <div className={styles.studentName}>{student.first_name} {student.last_name}</div>
                  </td>
                  {subjects.map(sub => (
                    <td key={sub}>
                      <input 
                        type="number" 
                        className={styles.markInput}
                        value={studentMarks[sub] || ''}
                        onChange={e => handleMarkChange(student.id, sub, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                  ))}
                  <td className={styles.totalCell}>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
