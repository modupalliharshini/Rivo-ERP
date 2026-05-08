'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import styles from '../super-admin/page.module.css';

interface SuperAdminHeaderProps {
  title: string;
  highlight: string;
  actionElement?: React.ReactNode;
}

export default function SuperAdminHeader({ title, highlight, actionElement }: SuperAdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminId, setAdminId] = useState('SA Admin');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem('superAdminId');
    if (savedId) {
      setAdminId(savedId.toUpperCase());
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('superAdminId');
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
        <h1 className={styles.title}>
          {title} <span className={styles.titleHighlight}>{highlight}</span>
        </h1>
        {actionElement}
      </div>
      
      <div className={styles.profileContainer} ref={dropdownRef}>
        <button 
          className={styles.profileTrigger} 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className={styles.profileText}>
            <span className={styles.greeting}>Welcome back,</span>
            <span className={styles.userName}>{adminId}</span>
          </div>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>SA</div>
            <ChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
          </div>
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem}>
              <User size={18} />
              <span>My Profile</span>
            </button>
            <button className={styles.dropdownItem}>
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
            <div className={styles.dropdownDivider}></div>
            <button 
              className={`${styles.dropdownItem} ${styles.logoutItem}`} 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
