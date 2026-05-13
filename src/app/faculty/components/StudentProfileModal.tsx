'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  Hash,
  MapPin,
  Phone,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

export default function StudentProfileModal({ isOpen, onClose, studentId }: StudentProfileModalProps) {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  const fetchStudentProfile = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (data) {
      setStudent(data);
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
        maxWidth: '600px',
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              {student?.first_name?.[0]}{student?.last_name?.[0]}
            </div>
            <div>
              <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0}}>
                Student Profile
              </h2>
              <p style={{fontSize: '0.875rem', color: '#64748b', margin: 0}}>
                Institutional Records
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s'}} onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{padding: '2rem'}}>
          {isLoading ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1rem'}}>
              <Loader2 className="animate-spin" size={40} color="#3b82f6" />
              <p style={{color: '#64748b', fontWeight: '500'}}>Fetching student details...</p>
            </div>
          ) : student ? (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              {/* Personal Section */}
              <div style={{gridColumn: '1 / -1', marginBottom: '0.5rem'}}>
                <h3 style={{fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem'}}>
                  Basic Information
                </h3>
              </div>
              
              <InfoItem icon={<User size={18} />} label="Full Name" value={`${student.first_name} ${student.last_name}`} />
              <InfoItem icon={<Mail size={18} />} label="Email Address" value={student.email} />
              <InfoItem icon={<Hash size={18} />} label="Roll Number" value={student.roll_no || student.email.split('@')[0]} />
              <InfoItem icon={<BookOpen size={18} />} label="Grade / Class" value={student.grade || 'Not Assigned'} />

              {/* Administrative Section */}
              <div style={{gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem'}}>
                <h3 style={{fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem'}}>
                  Academic Context
                </h3>
              </div>

              <InfoItem icon={<Shield size={18} />} label="Institution ID" value={student.institution_id} />
              <InfoItem icon={<Clock size={18} />} label="Member Since" value={new Date(student.created_at).toLocaleDateString()} />
              
              <div style={{
                gridColumn: '1 / -1',
                marginTop: '1rem',
                padding: '1.25rem',
                background: '#f0f9ff',
                borderRadius: '16px',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{color: '#0369a1'}}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{margin: 0, fontSize: '0.9375rem', fontWeight: '700', color: '#0c4a6e'}}>Campus Residency</h4>
                  <p style={{margin: 0, fontSize: '0.8125rem', color: '#0369a1'}}>Institutional Location: {student.institution_id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem'}}>
              <p style={{color: '#ef4444'}}>Failed to load student profile.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.625rem 1.25rem',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Close Profile
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
      <div style={{
        marginTop: '0.25rem',
        color: '#94a3b8'
      }}>
        {icon}
      </div>
      <div>
        <p style={{margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em'}}>
          {label}
        </p>
        <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b'}}>
          {value}
        </p>
      </div>
    </div>
  );
}
