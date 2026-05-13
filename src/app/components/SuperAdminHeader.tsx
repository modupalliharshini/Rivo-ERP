'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import SuperAdminHeaderStyles from '../super-admin/page.module.css';
import { createClient } from '@/utils/supabase/client';
import ProfileModal from './ProfileModal';

interface SuperAdminHeaderProps {
  title: string;
  highlight: string;
  actionElement?: React.ReactNode;
}

export default function SuperAdminHeader({ title, highlight, actionElement }: SuperAdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [initials, setInitials] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    if (profile?.first_name) {
      const fullName = `${profile.first_name} ${profile.last_name || ''}`.trim();
      const computedInitials = `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase();
      setDisplayName(fullName);
      setInitials(computedInitials);
    }
  };

  useEffect(() => {
    loadProfile();

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const supabase = createClient();

  const handleLogout = async () => {
    localStorage.removeItem('superAdminId');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className={SuperAdminHeaderStyles.header}>
      <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
        <h1 className={SuperAdminHeaderStyles.title}>
          {title} <span className={SuperAdminHeaderStyles.titleHighlight}>{highlight}</span>
        </h1>
        {actionElement}
      </div>
      
      <div className={SuperAdminHeaderStyles.profileContainer} ref={dropdownRef}>
        <button 
          className={SuperAdminHeaderStyles.profileTrigger} 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className={SuperAdminHeaderStyles.profileText}>
            <span className={SuperAdminHeaderStyles.greeting}>Welcome back,</span>
            <span className={SuperAdminHeaderStyles.userName}>{displayName || '...'}</span>
          </div>
          <div className={SuperAdminHeaderStyles.avatarWrapper}>
            <div className={SuperAdminHeaderStyles.avatar}>{initials || '??'}</div>
            <ChevronDown className={`${SuperAdminHeaderStyles.chevron} ${isDropdownOpen ? SuperAdminHeaderStyles.chevronOpen : ''}`} size={16} />
          </div>
        </button>

        {isDropdownOpen && (
          <div className={SuperAdminHeaderStyles.dropdownMenu}>
            <button 
              className={SuperAdminHeaderStyles.dropdownItem} 
              onClick={() => { setIsProfileOpen(true); setIsDropdownOpen(false); }}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
            <button 
              className={SuperAdminHeaderStyles.dropdownItem}
              onClick={() => { setIsProfileOpen(true); setIsDropdownOpen(false); }}
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
            <div className={SuperAdminHeaderStyles.dropdownDivider}></div>
            <button 
              className={`${SuperAdminHeaderStyles.dropdownItem} ${SuperAdminHeaderStyles.logoutItem}`} 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileUpdate={() => loadProfile()}
      />
    </header>
  );
}
