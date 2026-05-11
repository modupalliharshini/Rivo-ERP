"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './FacultySidebar.module.css';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileText,
  Users,
  Notebook,
  CalendarDays,
  Headphones,
  UserCircle,
  Menu,
  X
} from 'lucide-react';

const FACULTY_MENU_ITEMS = [
  { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
  { name: 'My Classes', path: '/faculty/my-classes', icon: BookOpen },
  { name: 'Attendance Register', path: '/faculty/attendance', icon: CalendarCheck },
  { name: 'Assignments', path: '/faculty/assignments', icon: ClipboardList },
  { name: 'Grades & Exams', path: '/faculty/grades', icon: FileText },
  { name: 'My Students', path: '/faculty/students', icon: Users },
  { name: 'Counselling Diary', path: '/faculty/counselling', icon: Notebook },
  { name: 'Time Tables', path: '/faculty/timetable', icon: CalendarDays },
  { name: 'Ticketing Support', path: '/faculty/support', icon: Headphones },
];

export default function FacultySidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
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
            {FACULTY_MENU_ITEMS.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/faculty' && pathname.startsWith(item.path));
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
            href="/faculty/profile"
            className={`${styles.navItem} ${pathname === '/faculty/profile' ? styles.active : ''}`}
          >
            <UserCircle className={styles.navIcon} />
            <span>Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
