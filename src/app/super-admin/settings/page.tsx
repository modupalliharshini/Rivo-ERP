'use client';

import React, { useState } from 'react';
import { 
  Server, 
  Shield, 
  Save, 
  Activity,
  Globe,
  Mail,
  Lock
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';

export default function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [passwordComplexity, setPasswordComplexity] = useState(true);

  const Toggle = ({ checked, onChange, label, sublabel, reverse }: any) => (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
      <div>
        <div style={{fontWeight: '700', fontSize: '1.05rem', color: '#1e293b', marginBottom: '0.25rem'}}>{label}</div>
        {sublabel && <p style={{fontSize: '0.85rem', color: '#64748b'}}>{sublabel}</p>}
      </div>
      <label className={sectionStyles.toggleSwitch}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={sectionStyles.toggleSlider}></span>
      </label>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="System" highlight="Settings" />

      <div className={sectionStyles.settingsGrid}>
        {/* Global Configuration */}
        <div className={sectionStyles.settingsCard}>
          <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Globe size={20} color="#3b82f6" /> Global Configuration
          </h3>
          
          <div className={sectionStyles.formGrid}>
            <div className={sectionStyles.formGroup}>
              <label className={sectionStyles.formLabel}>Platform Name</label>
              <input type="text" className={sectionStyles.formInput} defaultValue="Rivo ERP" />
            </div>
            <div className={sectionStyles.formGroup}>
              <label className={sectionStyles.formLabel}>Support Email</label>
              <input type="email" className={sectionStyles.formInput} defaultValue="support@rivo.erp" />
            </div>
          </div>

          <div style={{margin: '2rem 0'}}>
             <label className={sectionStyles.formLabel} style={{display: 'block', marginBottom: '1rem'}}>Maintenance Mode</label>
             <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <label className={sectionStyles.toggleSwitch}>
                  <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
                  <span className={sectionStyles.toggleSlider}></span>
                </label>
                <span style={{fontSize: '0.95rem', color: '#475569', fontWeight: '500'}}>Enable global maintenance mode</span>
             </div>
          </div>

          <div className={sectionStyles.formGroup} style={{marginBottom: '2rem', maxWidth: '400px'}}>
            <label className={sectionStyles.formLabel}>Default Local Currency</label>
            <select className={sectionStyles.formSelect}>
              <option>Indian Rupee (₹)</option>
              <option>US Dollar ($)</option>
              <option>Euro (€)</option>
              <option>British Pound (£)</option>
            </select>
          </div>

          <button className={sectionStyles.btnPost} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#3b82f6'}}>
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* System Health */}
        <div className={sectionStyles.healthCard}>
          <div className={sectionStyles.healthIcon}>
            <Server size={32} />
          </div>
          <h3 className={sectionStyles.healthTitle}>System Health</h3>
          <p className={sectionStyles.healthStatus}>All systems operational</p>
          
          <div className={sectionStyles.healthStats}>
            <div className={sectionStyles.healthStatRow}>
              <span className={sectionStyles.healthStatLabel}>Server Load</span>
              <span className={sectionStyles.healthStatValue}>12%</span>
            </div>
            <div className={sectionStyles.healthStatRow}>
              <span className={sectionStyles.healthStatLabel}>Storage Used</span>
              <span className={sectionStyles.healthStatValue}>45%</span>
            </div>
          </div>

          <button className={sectionStyles.btnOutline} style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', borderColor: '#e2e8f0'}}>
            <Activity size={18} /> Run Diagnostics
          </button>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className={sectionStyles.settingsCard}>
        <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <Shield size={20} color="#0e844a" /> Security & Authentication
        </h3>

        <div style={{maxWidth: '600px'}}>
          <Toggle 
            checked={twoFactor} 
            onChange={setTwoFactor} 
            label="Two-Factor Authentication" 
            sublabel="Require 2FA for all administrative logins"
          />
          <Toggle 
            checked={passwordComplexity} 
            onChange={setPasswordComplexity} 
            label="Password Complexity" 
            sublabel="Enforce strong password requirements"
          />
        </div>
      </div>
    </div>
  );
}
