'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Loader2, Clock, MapPin, Users as UsersIcon } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StudentTimetablePage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch student profile to get grade
      const { data: profile } = await supabase
        .from('profiles')
        .select('grade, institution_id')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('timetables')
        .select('*, profiles(first_name, last_name)')
        .eq('institution_id', profile.institution_id)
        .eq('grade', profile.grade)
        .order('start_time', { ascending: true });

      if (data) setSchedule(data);
      setIsLoading(false);
    };

    fetchSchedule();
  }, []);

  if (isLoading) return <div className={styles.loading}><Loader2 className="spin" /> Loading Timetable...</div>;

  return (
    <main className={styles.main}>
      <PageHeader titleStart="Weekly" titleHighlight="Timetable" />

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
                      {slot.profiles && <span><UsersIcon size={14} /> {slot.profiles.first_name} {slot.profiles.last_name}</span>}
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
