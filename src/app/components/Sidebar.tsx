'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  Banknote,
  FileEdit,
  BookOpen,
  Library,
  Building,
  Bus,
  TrendingUp,
  Headphones,
  Settings
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', path: '/dashboard/students', icon: GraduationCap },
  { name: 'Faculty', path: '/dashboard/faculty', icon: Users },
  { name: 'Attendance', path: '/dashboard/attendance', icon: CalendarCheck },
  { name: 'Fees & Finance', path: '/dashboard/fees', icon: Banknote },
  { name: 'Exam Section', path: '/dashboard/exams', icon: FileEdit },
  { name: 'Courses', path: '/dashboard/courses', icon: BookOpen },
  { name: 'Library', path: '/dashboard/library', icon: Library },
  { name: 'Hostel', path: '/dashboard/hostel', icon: Building },
  { name: 'Transport', path: '/dashboard/transport', icon: Bus },
  { name: 'Reports', path: '/dashboard/reports', icon: TrendingUp },
  { name: 'Ticketing Support', path: '/dashboard/support', icon: Headphones },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
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


      <nav>
        <ul className={styles.navList}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
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
    </aside>
  );
}
