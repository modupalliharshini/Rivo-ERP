"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './StudentSidebar.module.css';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  FileCheck,
  GraduationCap,
  Clock,
  Banknote,
  Book,
  Building,
  MessageSquare,
  Headphones,
  UserCircle
} from 'lucide-react';

const STUDENT_MENU_ITEMS = [
  { name: 'Home', path: '/student', icon: LayoutDashboard },
  { name: 'My Courses', path: '/student/my-courses', icon: BookOpen },
  { name: 'Assignments', path: '/student/assignments', icon: ClipboardList },
  { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
  { name: 'Exam Section', path: '/student/exams', icon: FileCheck },
  { name: 'My CGPA', path: '/student/cgpa', icon: GraduationCap },
  { name: 'Time Tables', path: '/student/timetable', icon: Clock },
  { name: 'Fee Payments', path: '/student/fees', icon: Banknote },
  { name: 'Library', path: '/student/library', icon: Book },
  { name: 'Hostel & Mess', path: '/student/hostel', icon: Building },
  { name: 'Feedback Survey', path: '/student/feedback', icon: MessageSquare },
  { name: 'Ticketing Support', path: '/student/support', icon: Headphones },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Image 
          src="/logo.png" 
          alt="Rivo" 
          width={180} 
          height={40} 
          className={styles.sidebarLogo} 
          priority
        />
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {STUDENT_MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/student' && pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <Icon className={`${styles.navIcon} ${isActive ? styles.activeIcon : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <Link
          href="/student/profile"
          className={`${styles.navItem} ${pathname === '/student/profile' ? styles.active : ''}`}
        >
          <UserCircle className={styles.navIcon} />
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
}
