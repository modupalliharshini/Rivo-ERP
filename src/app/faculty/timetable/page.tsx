'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Loader2, Clock, MapPin, GraduationCap } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function FacultyTimetablePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('faculty_id', user.id)
        .order('start_time', { ascending: true });

      if (data) setSchedule(data);
      setIsLoading(false);
    };

    fetchSchedule();
  }, []);

  if (isLoading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Schedule...</div>;

  return (
    <main className={styles.main}>
      <PageHeader titleStart="My" titleHighlight="Schedule" />

      <div className={styles.grid}>
        {DAYS.map(day => (
          <div key={day} className={styles.dayColumn}>
            <h3 className={styles.dayTitle}>{day}</h3>
            <div className={styles.slots}>
              {schedule.filter(s => s.day_of_week === day).length === 0 ? (
                <div className={styles.empty}>No classes</div>
              ) : (
                schedule.filter(s => s.day_of_week === day).map(slot => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.timeRow}>
                      <Clock size={14} />
                      <span>{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                    </div>
                    <h4 className={styles.subject}>{slot.subject}</h4>
                    <div className={styles.meta}>
                      <span><GraduationCap size={14} /> {slot.grade}</span>
                      {slot.room && <span><MapPin size={14} /> {slot.room}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
