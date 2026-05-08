import React from 'react';
import styles from './FacultySchedule.module.css';

interface ScheduleItem {
  time: string;
  subject: string;
  room: string;
  action?: string;
  day?: string;
}

interface FacultyScheduleProps {
  type: 'daily' | 'weekly';
  items: ScheduleItem[];
}

export default function FacultySchedule({ type, items }: FacultyScheduleProps) {
  if (type === 'daily') {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Subject</th>
              <th>Room</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className={styles.timeCell}>{item.time}</td>
                <td>{item.subject}</td>
                <td className={styles.roomCell}>{item.room}</td>
                <td>
                  {item.action === 'Mark Attendance' ? (
                    <button className={styles.actionBtn}>Mark Attendance</button>
                  ) : (
                    <span className={styles.upcomingBadge}>Upcoming</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Weekly layout
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = Array.from(new Set(items.map(i => i.time))).sort();

  return (
    <div className={styles.gridWrapper}>
      <table className={styles.weeklyTable}>
        <thead>
          <tr>
            <th>Time</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td className={styles.stickyTime}>{time}</td>
              {days.map(day => {
                const session = items.find(i => i.time === time && i.day === day);
                return (
                  <td key={day} className={session ? styles.activeCell : styles.emptyCell}>
                    {session && (
                      <div className={styles.sessionBox}>
                        <div className={styles.sessionSubject}>{session.subject}</div>
                        <div className={styles.sessionRoom}>{session.room}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
