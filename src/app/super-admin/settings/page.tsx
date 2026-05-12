'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Shield, 
  Save, 
  Activity,
  Globe,
  Mail,
  Loader2,
  CheckCircle2,
  Palette,
  Bell,
  Database,
  Lock,
  Clock,
  Layout,
  RefreshCw
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import { createClient } from '@/utils/supabase/client';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>({
    platform_name: 'Rivo ERP',
    support_email: 'support@rivo.erp',
    maintenance_mode: false,
    local_currency: 'Indian Rupee (₹)',
    two_factor_auth: true,
    password_complexity: true,
    session_timeout: '30 mins',
    backup_frequency: 'Daily',
    notification_alerts: true,
    theme_color: '#3b82f6'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (!error && data) {
        setSettings({...settings, ...data});
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleColorChange = (color: string) => {
    setSettings({...settings, theme_color: color});
    // Live preview
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Calculate and set hover/light colors for live preview
    const darken = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
      return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
    };
    
    document.documentElement.style.setProperty('--primary-hover', darken(color, 15));
    document.documentElement.style.setProperty('--primary-light', color + '1a');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    const { error } = await supabase
      .from('system_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id);

    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        background: activeTab === id ? 'white' : 'transparent',
        color: activeTab === id ? '#3b82f6' : '#64748b',
        fontWeight: '600',
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: activeTab === id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.2s ease',
        width: '100%',
        textAlign: 'left'
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <SuperAdminHeader title="System" highlight="Settings" />
        <div style={{padding: '5rem', textAlign: 'center', color: '#64748b'}}>
          <Loader2 className="animate-spin" style={{margin: '0 auto 1rem'}} size={32} />
          Initialising configuration engine...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="System" highlight="Settings" />

      <div style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', marginTop: '1rem'}}>
        {/* Navigation Sidebar */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <TabButton id="general" icon={Globe} label="General Config" />
          <TabButton id="branding" icon={Palette} label="Branding & UI" />
          <TabButton id="security" icon={Lock} label="Security Policy" />
          <TabButton id="system" icon={Database} label="System & Backup" />
          
          <div style={{marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: '700', marginBottom: '0.75rem'}}>
              <Activity size={16} color="#10b981" /> System Pulse
            </div>
            <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem'}}>All systems are running at peak performance.</div>
            <div style={{height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden'}}>
               <div style={{width: '98%', height: '100%', background: '#10b981'}}></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={sectionStyles.card} style={{padding: '2.5rem', background: 'white', borderRadius: '24px'}}>
          
          {activeTab === 'general' && (
            <div className="fade-in">
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem'}}>General Configuration</h2>
              <div className={sectionStyles.formGrid}>
                <div className={sectionStyles.formGroup}>
                  <label className={sectionStyles.formLabel}>Platform Identity</label>
                  <input 
                    type="text" 
                    className={sectionStyles.formInput} 
                    value={settings.platform_name}
                    onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
                    placeholder="e.g. Rivo ERP"
                  />
                </div>
                <div className={sectionStyles.formGroup}>
                  <label className={sectionStyles.formLabel}>Support Command Center (Email)</label>
                  <input 
                    type="email" 
                    className={sectionStyles.formInput} 
                    value={settings.support_email}
                    onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                  />
                </div>
                <div className={sectionStyles.formGroup}>
                  <label className={sectionStyles.formLabel}>Default Currency</label>
                  <select 
                    className={sectionStyles.formSelect}
                    value={settings.local_currency}
                    onChange={(e) => setSettings({...settings, local_currency: e.target.value})}
                  >
                    <option>Indian Rupee (₹)</option>
                    <option>US Dollar ($)</option>
                    <option>Euro (€)</option>
                  </select>
                </div>
                <div className={sectionStyles.formGroup}>
                  <label className={sectionStyles.formLabel}>Regional Timezone</label>
                  <select className={sectionStyles.formSelect}>
                    <option>UTC +5:30 (India)</option>
                    <option>UTC -5:00 (EST)</option>
                    <option>UTC +0:00 (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="fade-in">
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem'}}>Branding & UI</h2>
              <div style={{maxWidth: '500px'}}>
                 <label className={sectionStyles.formLabel} style={{display: 'block', marginBottom: '1.5rem'}}>Primary Theme Color</label>
                 <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem'}}>Select your organization's primary brand color. This will be applied across all dashboard accents and buttons.</p>
                 <div style={{display: 'flex', gap: '1.25rem', flexWrap: 'wrap'}}>
                    {['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#0f172a', '#7c3aed'].map(c => (
                      <button 
                        key={c}
                        onClick={() => handleColorChange(c)}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '14px',
                          background: c,
                          border: settings.theme_color === c ? '3px solid #3b82f6' : '3px solid transparent',
                          outline: settings.theme_color === c ? '2px solid #e2e8f0' : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: settings.theme_color === c ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="fade-in">
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem'}}>Security Policy</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px'}}>
                  <div>
                    <div style={{fontWeight: '700', color: '#1e293b'}}>Two-Factor Authentication</div>
                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>Mandatory for all admin and faculty accounts</div>
                  </div>
                  <label className={sectionStyles.toggleSwitch}>
                    <input type="checkbox" checked={settings.two_factor_auth} onChange={(e) => setSettings({...settings, two_factor_auth: e.target.checked})} />
                    <span className={sectionStyles.toggleSlider}></span>
                  </label>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px'}}>
                  <div>
                    <div style={{fontWeight: '700', color: '#1e293b'}}>Password Complexity</div>
                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>Require symbols, numbers and mixed case</div>
                  </div>
                  <label className={sectionStyles.toggleSwitch}>
                    <input type="checkbox" checked={settings.password_complexity} onChange={(e) => setSettings({...settings, password_complexity: e.target.checked})} />
                    <span className={sectionStyles.toggleSlider}></span>
                  </label>
                </div>
                <div className={sectionStyles.formGroup} style={{maxWidth: '300px'}}>
                  <label className={sectionStyles.formLabel}><Clock size={16} style={{display: 'inline', marginRight: '0.5rem'}} /> Session Timeout</label>
                  <select className={sectionStyles.formSelect} value={settings.session_timeout} onChange={(e) => setSettings({...settings, session_timeout: e.target.value})}>
                    <option>15 mins</option>
                    <option>30 mins</option>
                    <option>1 hour</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="fade-in">
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem'}}>System & Backup</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                <div style={{padding: '1.5rem', border: '1px solid #fee2e2', background: '#fff5f5', borderRadius: '16px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontWeight: '700', color: '#991b1b'}}>Global Maintenance Mode</div>
                      <div style={{fontSize: '0.85rem', color: '#b91c1c'}}>Disable all public and user portals for updates</div>
                    </div>
                    <label className={sectionStyles.toggleSwitch}>
                      <input type="checkbox" checked={settings.maintenance_mode} onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})} />
                      <span className={sectionStyles.toggleSlider} style={{background: settings.maintenance_mode ? '#ef4444' : '#ccc'}}></span>
                    </label>
                  </div>
                </div>
                <div className={sectionStyles.formGrid}>
                   <div className={sectionStyles.formGroup}>
                      <label className={sectionStyles.formLabel}>Cloud Backup Frequency</label>
                      <select className={sectionStyles.formSelect} value={settings.backup_frequency} onChange={(e) => setSettings({...settings, backup_frequency: e.target.value})}>
                        <option>Hourly</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                   </div>
                   <div className={sectionStyles.formGroup}>
                      <label className={sectionStyles.formLabel}>Log Retention Period</label>
                      <select className={sectionStyles.formSelect}>
                        <option>30 Days</option>
                        <option>90 Days</option>
                        <option>1 Year</option>
                      </select>
                   </div>
                </div>
              </div>
            </div>
          )}

          <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end'}}>
             <button 
                className={sectionStyles.btnPost} 
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  background: saveSuccess ? '#10b981' : '#0f172a', 
                  padding: '1rem 2.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
             >
               {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
               {saveSuccess ? 'Changes Applied Successfully' : 'Commit All Changes'}
             </button>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
