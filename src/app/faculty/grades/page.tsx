'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { createClient } from '../../../utils/supabase/client';
import { Loader2, Save, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GradesPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  
  const [facultyClasses, setFacultyClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState(''); // "grade|subject"
  const [selectedExamId, setSelectedExamId] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch Faculty Classes
    const { data: schedule } = await supabase
      .from('timetables')
      .select('grade, subject')
      .eq('faculty_id', user.id);

    if (schedule) {
      const unique = Array.from(new Set(schedule.map(s => `${s.grade}|${s.subject}`)));
      const classes = unique.map(u => ({ label: `${u.split('|')[1]} (${u.split('|')[0]})`, value: u }));
      setFacultyClasses(classes);
      if (classes.length > 0) setSelectedClass(classes[0].value);
    }

    // 2. Fetch Exams for the institution
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (profile) {
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .order('date', { ascending: false });
      
      if (examsData) {
        setExams(examsData);
        if (examsData.length > 0) setSelectedExamId(examsData[0].id);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedClass && selectedExamId) {
      fetchGradesData();
    }
  }, [selectedClass, selectedExamId]);

  const fetchGradesData = async () => {
    const [grade, subject] = selectedClass.split('|');
    
    // Fetch Students in this grade
    const { data: studentsData } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, roll_no')
      .eq('grade', grade)
      .eq('role', 'student');

    // Fetch existing results for this exam
    const { data: resultsData } = await supabase
      .from('results')
      .select('*')
      .eq('exam_id', selectedExamId);

    if (studentsData) {
      setStudents(studentsData);
      
      // Map scores from results
      const newScores: Record<string, number> = {};
      resultsData?.forEach(r => {
        if (r.subject_marks && r.subject_marks[subject] !== undefined) {
          newScores[r.student_id] = r.subject_marks[subject];
        }
      });
      setScores(newScores);
    }
  };

  const handleSave = async (studentId: string) => {
    const [grade, subject] = selectedClass.split('|');
    const score = scores[studentId];
    if (score === undefined) return;

    setIsSaving(prev => ({ ...prev, [studentId]: true }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

      // Get current results entry to preserve other subject marks
      const { data: currentResult } = await supabase
        .from('results')
        .select('*')
        .eq('exam_id', selectedExamId)
        .eq('student_id', studentId)
        .single();

      const newSubjectMarks = currentResult?.subject_marks || {};
      newSubjectMarks[subject] = score;

      const { error } = await supabase
        .from('results')
        .upsert({
          id: currentResult?.id, // include ID for update
          institution_id: profile?.institution_id,
          exam_id: selectedExamId,
          student_id: studentId,
          subject_marks: newSubjectMarks,
          total_marks: Object.values(newSubjectMarks).reduce((a: any, b: any) => a + b, 0) as number
        });

      if (error) throw error;
      
      // Temporary success state handled by isSaving logic
    } catch (err) {
      console.error(err);
      alert('Failed to save grade');
    } finally {
      setTimeout(() => {
        setIsSaving(prev => ({ ...prev, [studentId]: false }));
      }, 1000);
    }
  };

  function getGrade(score: number): { label: string; color: string } {
    if (!score && score !== 0) return { label: '-', color: '#94a3b8' };
    if (score >= 90) return { label: 'A', color: '#059669' };
    if (score >= 80) return { label: 'A-', color: '#10b981' };
    if (score >= 70) return { label: 'B+', color: '#d97706' };
    if (score >= 60) return { label: 'B', color: '#f59e0b' };
    return { label: 'C', color: '#dc2626' };
  }

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Student" titleHighlight="Grades" />

      <div className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Course & Class</label>
          <select 
            className={styles.filterSelect} 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
          >
            {facultyClasses.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Assessment / Exam</label>
          <select 
            className={styles.filterSelect} 
            value={selectedExamId} 
            onChange={e => setSelectedExamId(e.target.value)}
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({new Date(e.date).getFullYear()})</option>
            ))}
          </select>
        </div>
        <button className={styles.viewBtn} onClick={fetchGradesData}>Refresh Data</button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            {selectedClass ? `${selectedClass.split('|')[1]} Grades - ${selectedClass.split('|')[0]}` : 'Grades Management'}
          </h2>
          <button className={styles.exportBtn}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className="spin" size={32} />
            <p>Fetching Gradebook...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Score (100)</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const score = scores[student.id] || 0;
                const grade = getGrade(score);
                const saving = isSaving[student.id];

                return (
                  <tr key={student.id}>
                    <td>{student.roll_no || 'N/A'}</td>
                    <td className={styles.studentName}>{student.first_name} {student.last_name}</td>
                    <td>
                      <input
                        type="number"
                        className={styles.scoreInput}
                        value={scores[student.id] || ''}
                        min={0}
                        max={100}
                        placeholder="0"
                        onChange={e => setScores(prev => ({ ...prev, [student.id]: Number(e.target.value) }))}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.gradeBadge}
                        style={{ background: grade.color }}
                      >
                        {grade.label}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.saveBtn} ${saving ? styles.saving : ''}`}
                        onClick={() => handleSave(student.id)}
                        disabled={saving}
                      >
                        {saving ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save</>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
