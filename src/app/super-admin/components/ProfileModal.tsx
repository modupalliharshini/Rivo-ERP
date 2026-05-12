'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Loader2, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import { createClient } from '@/utils/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: () => void;
}

export default function ProfileModal({ isOpen, onClose, onProfileUpdate }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: user.email || ''
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name
      })
      .eq('id', user?.id);

    if (!error) {
      setSuccess(true);
      if (onProfileUpdate) onProfileUpdate();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    });

    if (!error) {
      setSuccess(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(error.message);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '550px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Shield size={22} color="#3b82f6" /> Account Management
          </h2>
          <button onClick={onClose} style={{border: 'none', background: 'none', cursor: 'pointer', color: '#64748b'}}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{display: 'flex', borderBottom: '1px solid #f1f5f9'}}>
           <button 
            onClick={() => setActiveTab('personal')}
            style={{
              flex: 1, 
              padding: '1rem', 
              border: 'none', 
              background: 'none', 
              fontSize: '0.95rem', 
              fontWeight: '600',
              color: activeTab === 'personal' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'personal' ? '2px solid #3b82f6' : 'none',
              cursor: 'pointer'
            }}
           >
             Personal Info
           </button>
           <button 
            onClick={() => setActiveTab('security')}
            style={{
              flex: 1, 
              padding: '1rem', 
              border: 'none', 
              background: 'none', 
              fontSize: '0.95rem', 
              fontWeight: '600',
              color: activeTab === 'security' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'security' ? '2px solid #3b82f6' : 'none',
              cursor: 'pointer'
            }}
           >
             Security & Password
           </button>
        </div>

        {/* Body */}
        <div style={{padding: '2rem'}}>
          {activeTab === 'personal' ? (
            <form onSubmit={handleUpdateProfile}>
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                  <div className={sectionStyles.formGroup}>
                    <label className={sectionStyles.formLabel}>First Name</label>
                    <input 
                      type="text" 
                      className={sectionStyles.formInput} 
                      value={profile.first_name}
                      onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className={sectionStyles.formGroup}>
                    <label className={sectionStyles.formLabel}>Last Name</label>
                    <input 
                      type="text" 
                      className={sectionStyles.formInput} 
                      value={profile.last_name}
                      onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    />
                  </div>
               </div>
               <div className={sectionStyles.formGroup} style={{marginBottom: '2rem'}}>
                  <label className={sectionStyles.formLabel}>Email Address (Read-only)</label>
                  <div style={{
                    padding: '0.75rem 1rem', 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <Mail size={18} /> {profile.email}
                  </div>
               </div>
               <button 
                type="submit" 
                className={sectionStyles.btnPost}
                disabled={isLoading}
                style={{width: '100%', background: success ? '#10b981' : '#3b82f6'}}
               >
                 {isLoading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle2 /> : <User size={18} />}
                 {success ? 'Profile Updated!' : 'Save Personal Details'}
               </button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword}>
               <div className={sectionStyles.formGroup} style={{marginBottom: '1.25rem'}}>
                  <label className={sectionStyles.formLabel}>New Password</label>
                  <div style={{position: 'relative'}}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className={sectionStyles.formInput} 
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      required
                      placeholder="Min 6 characters"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8'}}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>
               <div className={sectionStyles.formGroup} style={{marginBottom: '2rem'}}>
                  <label className={sectionStyles.formLabel}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className={sectionStyles.formInput} 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    required
                  />
               </div>
               <button 
                type="submit" 
                className={sectionStyles.btnPost}
                disabled={isLoading}
                style={{width: '100%', background: success ? '#10b981' : '#0f172a'}}
               >
                 {isLoading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle2 /> : <Shield size={18} />}
                 {success ? 'Password Changed!' : 'Update Security Credentials'}
               </button>
               <p style={{marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center'}}>
                 Updating your password will keep you logged in on this device.
               </p>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
