'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import PageHeader from '../../components/PageHeader';
import { Search, User, Users, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import StudentProfileModal from '../components/StudentProfileModal';

export default function MyStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Get unique grades assigned to this faculty from timetables
    const { data: assignments } = await supabase
      .from('timetables')
      .select('grade')
      .eq('faculty_id', user.id);

    const assignedGrades = Array.from(new Set(assignments?.map(a => a.grade) || []));

    if (assignedGrades.length > 0) {
      // 2. Fetch students in those grades
      const { data: studentsData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .in('grade', assignedGrades)
        .order('first_name', { ascending: true });

      if (studentsData) setStudents(studentsData);
    }
    setIsLoading(false);
  };

  const filtered = students.map(s => ({
    ...s,
    computedRollNo: s.roll_no || s.email.split('@')[0]
  })).filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.computedRollNo.toLowerCase().includes(search.toLowerCase()) ||
    s.grade?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.main}>
      <PageHeader titleStart="My" titleHighlight="Students" />

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            Student List {students.length > 0 ? `(${students.length})` : ''}
          </h2>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, roll no, or grade..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.refreshBtn} onClick={fetchStudents} disabled={isLoading}>
              <Loader2 size={14} className={isLoading ? styles.spin : ''} />
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className={styles.spin} size={40} color="var(--primary)" />
            <p>Loading your students...</p>
          </div>
        ) : filtered.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <span className={styles.rollNoBadge}>{s.computedRollNo}</span>
                  </td>
                  <td className={styles.studentName}>
                    {s.first_name} {s.last_name}
                  </td>
                  <td>{s.grade}</td>
                  <td>{s.email}</td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setIsProfileOpen(true);
                      }}
                    >
                      <User size={14} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} color="#cbd5e1" />
            <p>No students found {search ? 'matching your search' : 'for your assigned classes'}.</p>
          </div>
        )}
      </div>

      <StudentProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        studentId={selectedStudentId}
      />
    </main>
  );
}
