'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { Calendar, Download, Loader2, TrendingUp, Users, AlertCircle, Clock, Eye } from 'lucide-react';

const GRADES = ['Playgroup', 'Nursery', 'Pre-Primary 1', 'Pre-Primary 2'];

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [rawAttendance, setRawAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, rate: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const supabase = createClient();

  const openDetails = (slotRecord: any) => {
    const slotAtt = rawAttendance.filter(a => a.timetable_id === slotRecord.id);
    setSelectedDetails({
      ...slotRecord,
      students: slotAtt
    });
  };

  const downloadReport = async (slotRecord: any) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Attendance Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${date}`, 14, 30);
    doc.text(`Class: ${slotRecord.grade}`, 14, 35);
    doc.text(`Subject: ${slotRecord.subject}`, 14, 40);
    doc.text(`Time: ${slotRecord.time}`, 14, 45);
    
    // Stats
    doc.text(`Present: ${slotRecord.present}`, 140, 30);
    doc.text(`Absent: ${slotRecord.absent}`, 140, 35);
    doc.text(`Late: ${slotRecord.late}`, 140, 40);
    doc.text(`Percentage: ${slotRecord.percent}%`, 140, 45);

    const slotAtt = rawAttendance.filter(a => a.timetable_id === slotRecord.id);
    const tableData = slotAtt.map(a => [
      `${a.profiles?.first_name || ''} ${a.profiles?.last_name || ''}`,
      a.profiles?.email || '—',
      a.status
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Student Name', 'Email / ID', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#1d4ed8' }
    });

    doc.save(`Attendance_${slotRecord.grade}_${slotRecord.subject}_${date}.pdf`);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    // Fetch all attendance for the selected date with student names
    const { data: attData } = await supabase
      .from('attendance')
      .select(`
        *,
        timetables(subject, start_time),
        profiles:student_id(first_name, last_name, email)
      `)
      .eq('institution_id', profile.institution_id)
      .eq('date', date);

    // Fetch all scheduled slots for today (to show classes even with 0 attendance)
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const { data: slots } = await supabase
      .from('timetables')
      .select('*')
      .eq('institution_id', profile.institution_id)
      .eq('day_of_week', dayOfWeek);

    // Fetch student counts per grade
    const { data: students } = await supabase
      .from('profiles')
      .select('grade')
      .eq('institution_id', profile.institution_id)
      .eq('role', 'student');

    if (slots) {
      setRawAttendance(attData || []);
      const summary = slots.map(slot => {
        const slotAtt = attData?.filter(a => a.timetable_id === slot.id) || [];
        const totalInGrade = students?.filter(s => s.grade === slot.grade).length || 0;
        const present = slotAtt.filter(a => a.status === 'Present').length;
        const absent = slotAtt.filter(a => a.status === 'Absent').length;
        const late = slotAtt.filter(a => a.status === 'Late').length;
        const percent = totalInGrade > 0 ? Math.round((present / totalInGrade) * 100) : 0;
        
        return { 
          id: slot.id,
          grade: slot.grade, 
          subject: slot.subject,
          time: slot.start_time.substring(0, 5),
          totalInGrade, present, absent, late, percent 
        };
      });

      setRecords(summary);
      
      const totalPresent = summary.reduce((acc, s) => acc + s.present, 0);
      const totalAbsent = summary.reduce((acc, s) => acc + s.absent, 0);
      const totalLate = summary.reduce((acc, s) => acc + s.late, 0);
      const totalPossible = summary.reduce((acc, s) => acc + s.totalInGrade, 0);
      const totalRate = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
      
      setStats({ present: totalPresent, absent: totalAbsent, late: totalLate, rate: totalRate });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Live"
        titleHighlight="Attendance"
        actionElement={
          <div className={styles.headerActions}>
            <div className={styles.datePicker}>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <button className={styles.exportBtn}>
              <Download size={16} /> Export
            </button>
          </div>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><Users size={16} /> Present Today</div>
          <div className={styles.statValue}>{isLoading ? '...' : stats.present}</div>
          <div className={styles.progressBar}><div className={styles.fillGreen} style={{ width: `${stats.rate}%` }}></div></div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><AlertCircle size={16} /> Absentees</div>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{isLoading ? '...' : stats.absent}</div>
          <div className={styles.statusPill}>{stats.absent > 5 ? 'Action Required' : 'Normal'}</div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><Clock size={16} /> Late Entry</div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{isLoading ? '...' : stats.late}</div>
        </div>

        <div className={styles.statWrapper}>
          <div className={styles.statLabel}><TrendingUp size={16} /> Success Rate</div>
          <div className={styles.statValue}>{isLoading ? '...' : stats.rate}%</div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Class-wise Summary</h2>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Class / Grade</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Total Students</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Attendance %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /> Loading...</td></tr>
              ) : records.map((row) => (
                <tr key={row.id}>
                  <td className={styles.gradeCell}>{row.grade}</td>
                  <td className={styles.subjectCell}>{row.subject}</td>
                  <td>{row.time}</td>
                  <td>{row.totalInGrade}</td>
                  <td>{row.present}</td>
                  <td>{row.absent}</td>
                  <td>{row.late}</td>
                  <td>{row.percent}%</td>
                  <td>
                    <span className={`${styles.statusBadge} ${row.percent >= 90 ? styles.bgGreen : row.percent >= 75 ? styles.bgYellow : styles.bgRed}`}>
                      {row.percent >= 90 ? 'Excellent' : row.percent >= 75 ? 'Good' : 'Critical'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={styles.viewBtn} onClick={() => openDetails(row)}>
                        <Eye size={14} /> View
                      </button>
                      <button className={styles.downloadBtn} onClick={() => downloadReport(row)}>
                        <Download size={14} /> Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDetails && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDetails(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedDetails.grade} - {selectedDetails.subject}</h3>
                <p>{date} | {selectedDetails.time}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedDetails(null)}>×</button>
            </div>
            
            <div className={styles.modalContent}>
              {selectedDetails.students.length === 0 ? (
                <div className={styles.emptyDetails}>No attendance marked for this session.</div>
              ) : (
                <table className={styles.detailTable}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email / ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetails.students.map((a: any) => (
                      <tr key={a.id}>
                        <td>{a.profiles?.first_name} {a.profiles?.last_name}</td>
                        <td>{a.profiles?.email}</td>
                        <td>
                          <span className={`${styles.badge} ${
                            a.status === 'Present' ? styles.bgGreen : 
                            a.status === 'Absent' ? styles.bgRed : 
                            styles.bgYellow
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.modalDownloadBtn} onClick={() => downloadReport(selectedDetails)}>
                <Download size={16} /> Download Full PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
