'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import { Plus, Trash2, Edit2, Loader2, Calendar as CalendarIcon, Clock, Users as UsersIcon, MapPin } from 'lucide-react';
import styles from './page.module.css';

const GRADES = ['Playgroup', 'Nursery', 'Pre-Primary 1', 'Pre-Primary 2'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  'Playgroup': [
    'Literacy Book Team 1', 'Literacy Book Team 2', 'Picture Dictionary', 
    'Environmental Science', 'Rhymes', 'Premath Skills Team 1', 'Premath Skills Team 2'
  ],
  'Nursery': [
    'Math Concepts & Writing Team 1', 'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3',
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2', 'Environmental Science & Literacy Team 3',
    'Practice & Activity Sheets', 'Rhymes', 'Drawing & Coloring', 'Patterns Book'
  ],
  'Pre-Primary 1': [
    'Drawing & Colouring', 'Practice & Activity Sheets', 
    'Math Concepts & Writing Team 1', 'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3',
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2', 'Environmental Science & Literacy Team 3',
    'Rhymes, Stories & Reading', 'Hindi Concepts & Writing'
  ],
  'Pre-Primary 2': [
    'Rhymes, Stories & Reading', 'Drawing & Colouring', 'Practice & Activity Sheets',
    'Environmental Science & Literacy Team 1', 'Environmental Science & Literacy Team 2', 'Environmental Science & Literacy Team 3',
    'Math Concepts & Writing Team 1', 'Math Concepts & Writing Team 2', 'Math Concepts & Writing Team 3',
    'Hindi Concepts & Writing Team 1', 'Hindi Concepts & Writing Team 2'
  ]
};

export default function TimeTablePage() {
  const [activeGrade, setActiveGrade] = useState(GRADES[0]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    subject: '',
    faculty_id: '',
    room: ''
  });

  const supabase = createClient();

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    // Fetch Timetable
    const { data: schedule } = await supabase
      .from('timetables')
      .select('*, profiles(first_name, last_name)')
      .eq('institution_id', profile.institution_id)
      .eq('grade', activeGrade);

    // Fetch Faculty for dropdown
    const { data: staff } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, specialization')
      .eq('institution_id', profile.institution_id)
      .eq('role', 'faculty');

    if (schedule) setTimetable(schedule);
    if (staff) setFaculty(staff);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeGrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user?.id).single();

    try {
      if (editItem) {
        const { error } = await supabase
          .from('timetables')
          .update({
            ...formData,
            grade: activeGrade
          })
          .eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('timetables')
          .insert({
            ...formData,
            grade: activeGrade,
            institution_id: profile?.institution_id
          });
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditItem(null);
      setFormData({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        subject: '',
        faculty_id: '',
        room: ''
      });
      fetchData();
    } catch (err) {
      alert('Failed to save timetable entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    const { error } = await supabase.from('timetables').delete().eq('id', id);
    if (error) alert('Failed to delete');
    else fetchData();
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setFormData({
      day_of_week: item.day_of_week,
      start_time: item.start_time.substring(0, 5),
      end_time: item.end_time.substring(0, 5),
      subject: item.subject,
      faculty_id: item.faculty_id || '',
      room: item.room || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <PageHeader titleStart="School" titleHighlight="Timetable" />

      <div className={styles.gradeTabs}>
        {GRADES.map(grade => (
          <button 
            key={grade} 
            className={`${styles.gradeTab} ${activeGrade === grade ? styles.activeTab : ''}`}
            onClick={() => setActiveGrade(grade)}
          >
            {grade}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn-primary" onClick={() => { setEditItem(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Time Slot
        </button>
      </div>

      <div className={styles.timetableGrid}>
        {DAYS.map(day => (
          <div key={day} className={styles.dayColumn}>
            <h3 className={styles.dayTitle}>{day}</h3>
            <div className={styles.slots}>
              {timetable.filter(t => t.day_of_week === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map(slot => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.slotHeader}>
                      <span className={styles.time}><Clock size={14} /> {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                      <div className={styles.slotActions}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); console.log('Edit clicked', slot); openEditModal(slot); }}>
                          <Edit2 size={14} />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(slot.id); }} className={styles.deleteBtn}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className={styles.subject}>{slot.subject}</h4>
                    <div className={styles.slotMeta}>
                      {slot.profiles && <span><UsersIcon size={12} /> {slot.profiles.first_name} {slot.profiles.last_name}</span>}
                      {slot.room && <span><MapPin size={12} /> {slot.room}</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="erp-modal-overlay">
          <div className="erp-modal">
            <h2>{editItem ? 'Edit Time Slot' : 'Add New Time Slot'}</h2>
            <form onSubmit={handleSubmit} className="erp-form">
              <div className="erp-form-row">
                <div className="erp-form-group">
                  <label>Day of Week</label>
                  <select className="erp-select" value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="erp-form-group">
              <label>Subject</label>
              <select 
                className="erp-select" 
                required 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
              >
                <option value="">Select Subject</option>
                {SUBJECTS_BY_GRADE[activeGrade].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
              </div>
              <div className="erp-form-row">
                <div className="erp-form-group">
                  <label>Start Time</label>
                  <input className="erp-input" type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                </div>
                <div className="erp-form-group">
                  <label>End Time</label>
                  <input className="erp-input" type="time" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                </div>
              </div>
              <div className="erp-form-row">
                <div className="erp-form-group">
                  <label>Faculty (Optional)</label>
                  <select className="erp-select" value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value})}>
                    <option value="">Select Faculty</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.first_name} {f.last_name} ({f.specialization})</option>)}
                  </select>
                </div>
                <div className="erp-form-group">
                  <label>Room (Optional)</label>
                  <input className="erp-input" type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g. Room 101" />
                </div>
              </div>
              <div className="erp-form-actions">
                <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="erp-btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="spin" size={16} /> : 'Save Slot'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
