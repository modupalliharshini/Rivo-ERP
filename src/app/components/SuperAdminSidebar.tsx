'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Headphones,
  ScrollText,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
  { name: 'Institutions', path: '/super-admin/institutions', icon: Building2 },
  { name: 'Global Users', path: '/super-admin/users', icon: Users2 },
  { name: 'Global Tickets', path: '/super-admin/support', icon: Headphones },
  { name: 'Audit Logs', path: '/super-admin/audit', icon: ScrollText },
  { name: 'Global Reports', path: '/super-admin/reports', icon: BarChart3 },
  { name: 'System Settings', path: '/super-admin/settings', icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className={styles.mobileNav}>
        <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {!isOpen && (
          <div className={styles.mobileLogo}>
            <Image 
              src="/logo.png" 
              alt="Rivo" 
              width={120} 
              height={30} 
              priority
            />
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
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
    </>
  );
}
