'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Loader2, CheckCircle2, UserCheck, UserX, Clock } from 'lucide-react';

const GRADES = ['Playgroup', 'Nursery', 'Pre-Primary 1', 'Pre-Primary 2'];
const SECTIONS = ['A', 'B', 'C'];

type Status = 'Present' | 'Absent' | 'Late';

export default function FacultyAttendancePage() {
  const [scheduledSlots, setScheduledSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('A'); // Default section
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const fetchMySlots = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get day of week from date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];

    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('faculty_id', user.id)
      .eq('day_of_week', dayName);
    
    if (data) {
      if (data && data.length > 0) {
        setScheduledSlots(data);
        setSelectedSlotId(data[0].id);
        setSelectedGrade(data[0].grade);
        // We don't have 'section' in timetables yet, so we'll use a default or assume it's part of 'grade' or 'room'
        // Actually, I'll add section to timetables if needed, but for now I'll just use the dropdown.
      } else {
        setScheduledSlots([]);
        setSelectedSlotId('');
        setSelectedGrade('');
      }
    }
  };

  useEffect(() => {
    fetchMySlots();
  }, [date]);

  const fetchStudents = async () => {
    if (!selectedGrade) {
      alert('No class selected');
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

    console.log('Fetching students for:', { grade: selectedGrade, section: selectedSection, institution: profile?.institution_id });

    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('institution_id', profile?.institution_id)
      .eq('role', 'student')
      .select('*')
      .eq('grade', selectedGrade)
      .ilike('section', selectedSection)
      .eq('role', 'student');

    if (error) {
      alert('Failed to load students');
    } else {
      setStudents(data || []);
      const initial: Record<string, Status> = {};
      data.forEach(s => { initial[s.id] = 'Present'; });
      
      // Check if attendance already exists for this specific slot and date
      const { data: existing } = await supabase
        .from('attendance')
        .select('*')
        .eq('timetable_id', selectedSlotId)
        .eq('date', date);
      
      if (existing && existing.length > 0) {
        existing.forEach(e => { initial[e.student_id] = e.status as Status; });
        setIsSuccess(true);
      }
      
      setAttendance(initial);
    }
    setIsLoading(false);
  };

  const handleStatusChange = (studentId: string, status: Status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setIsSuccess(false);
  };

  const markAll = (status: Status) => {
    const updated = { ...attendance };
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
    setIsSuccess(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    try {
      const records = students.map(s => ({
        institution_id: profile.institution_id,
        student_id: s.id,
        faculty_id: user.id,
        date: date,
        status: attendance[s.id],
        grade: selectedGrade,
        section: selectedSection,
        timetable_id: selectedSlotId
      }));

      // Use upsert to handle updates for this specific slot
      const { error } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'student_id, date, timetable_id' });

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err) {
      alert('Failed to submit attendance');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Mark" titleHighlight="Attendance" />

      <div className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => {
              setDate(e.target.value);
              setStudents([]);
              setIsSuccess(false);
            }} 
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Grade / Class (Scheduled)</label>
          <select 
            value={selectedSlotId} 
            onChange={e => {
              const slotId = e.target.value;
              setSelectedSlotId(slotId);
              const slot = scheduledSlots.find(s => s.id === slotId);
              if (slot) setSelectedGrade(slot.grade);
              setStudents([]); 
              setIsSuccess(false);
            }}
          >
            {scheduledSlots.length === 0 ? (
              <option value="">No classes scheduled today</option>
            ) : (
              scheduledSlots.map(s => (
                <option key={s.id} value={s.id}>
                  {s.grade} - {s.subject} ({s.start_time.substring(0, 5)})
                </option>
              ))
            )}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Section</label>
          <select 
            value={selectedSection} 
            onChange={e => {
              setSelectedSection(e.target.value);
              setStudents([]);
              setIsSuccess(false);
            }}
          >
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={fetchStudents} disabled={isLoading || scheduledSlots.length === 0}>
          {isLoading ? <Loader2 className="spin" size={18} /> : 'Load Student List'}
        </button>
      </div>

      {students.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Student List ({students.length})</h2>
            <div className={styles.bulkActions}>
              <button className={styles.presentAll} onClick={() => markAll('Present')}>Mark All Present</button>
              <button className={styles.absentAll} onClick={() => markAll('Absent')}>Mark All Absent</button>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email / ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className={styles.nameCell}>{student.first_name} {student.last_name}</td>
                  <td className={styles.emailCell}>{student.email.split('@')[0].toUpperCase()}</td>
                  <td>
                    <div className={styles.statusGroup}>
                      <button 
                        className={`${styles.statusBtn} ${attendance[student.id] === 'Present' ? styles.activePresent : ''}`}
                        onClick={() => handleStatusChange(student.id, 'Present')}
                      >
                        <UserCheck size={16} /> Present
                      </button>
                      <button 
                        className={`${styles.statusBtn} ${attendance[student.id] === 'Absent' ? styles.activeAbsent : ''}`}
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                      >
                        <UserX size={16} /> Absent
                      </button>
                      <button 
                        className={`${styles.statusBtn} ${attendance[student.id] === 'Late' ? styles.activeLate : ''}`}
                        onClick={() => handleStatusChange(student.id, 'Late')}
                      >
                        <Clock size={16} /> Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.submitRow}>
            <button 
              className={isSuccess ? styles.successBtn : styles.submitBtn} 
              onClick={handleSubmit} 
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <Loader2 className="spin" size={20} />
              ) : isSuccess ? (
                'Attendance Submitted ✓'
              ) : (
                'Submit Attendance'
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
