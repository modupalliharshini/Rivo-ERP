'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import styles from './PageHeader.module.css';
import { createClient } from '@/utils/supabase/client';
import ProfileModal from './ProfileModal';

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
  const [userName, setUserName] = useState('');
  const [initials, setInitials] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.first_name) {
        const fullName = `${profile.first_name} ${profile.last_name || ''}`.trim();
        const computedInitials = `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase();
        setUserName(fullName);
        setInitials(computedInitials);
      } else {
        const displayId = profile.email.replace('@rivo.local', '');
        setUserName(displayId.toUpperCase());
        setInitials(displayId.slice(0, 2).toUpperCase());
      }
    }
  };

  useEffect(() => {
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

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('facultyId');
    localStorage.removeItem('studentId');
    await supabase.auth.signOut();
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
              <span className={styles.userName}>{userName || '...'}</span>
            </div>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>{initials || '??'}</div>
              <ChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu} id="profile-dropdown-menu">
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileOpen(true);
                }}
              >
                <User size={18} />
                <span>My Profile</span>
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileOpen(true);
                }}
              >
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
      
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileUpdate={loadProfile}
      />
    </header>
  );
}

