'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  titleStart: string;
  titleHighlight: string;
  actionElement?: React.ReactNode;
}

export default function PageHeader({
  titleStart,
  titleHighlight,
  actionElement,
}: PageHeaderProps) {
  const [userName, setUserName] = useState('Admin');
  const [initials, setInitials] = useState('AD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadProfile = () => {
      const savedEmail = localStorage.getItem('userEmail');
      const savedFacultyId = localStorage.getItem('facultyId');
      const savedStudentId = localStorage.getItem('studentId');
      
      if (savedEmail) {
        const namePart = savedEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const derivedInitials = namePart.slice(0, 2).toUpperCase();
        
        setUserName(formattedName);
        setInitials(derivedInitials);
      } else if (savedStudentId) {
        const profileName = localStorage.getItem('studentProfileName') || 'Alex Johnson';
        const computedInitials = profileName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AJ';
        setUserName(savedStudentId.toUpperCase());
        setInitials(computedInitials);
      } else if (savedFacultyId) {
        setUserName(savedFacultyId.toUpperCase());
        setInitials(savedFacultyId.slice(0, 2).toUpperCase());
      }
    };

    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('facultyId');
    localStorage.removeItem('studentId');
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        {titleStart} <span className={styles.titleHighlight}>{titleHighlight}</span>
      </h1>
      
      <div className={styles.actions}>
        {actionElement && <div className={styles.actionNode}>{actionElement}</div>}
        
        <div className={styles.profileContainer} ref={dropdownRef}>
          <button 
            id="profile-dropdown-trigger"
            className={styles.profileTrigger} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <div className={styles.userProfile}>
              <span className={styles.welcomeText}>Welcome back,</span>
              <span className={styles.userName}>{userName}</span>
            </div>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>{initials}</div>
              <ChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu} id="profile-dropdown-menu">
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (pathname.startsWith('/student')) {
                    router.push('/student/profile');
                  }
                }}
              >
                <User size={18} />
                <span>My Profile</span>
              </button>
              <button className={styles.dropdownItem}>
                <Settings size={18} />
                <span>Account Settings</span>
              </button>
              <div className={styles.dropdownDivider}></div>
              <button 
                id="logout-button"
                className={`${styles.dropdownItem} ${styles.logoutItem}`} 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

