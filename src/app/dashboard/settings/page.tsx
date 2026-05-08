import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="System"
        titleHighlight="Settings"
      />

      <div className={styles.layout}>
        {/* Profile Card */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Institution Profile</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Institution Name</label>
            <input 
              type="text" 
              className={styles.input} 
              defaultValue="Rivo International" 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Email</label>
            <input 
              type="email" 
              className={styles.input} 
              defaultValue="admin@rivo.erp" 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Timezone</label>
            <select className={styles.select}>
              <option>UTC +05:30 (India)</option>
              <option>UTC +00:00 (GMT)</option>
              <option>UTC -05:00 (EST)</option>
            </select>
          </div>

          <button className={styles.btnSave}>Save Changes</button>
        </section>

        {/* Preferences Card */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>System Preferences</h2>
          <div className={styles.preferenceList}>
            
            <div className={styles.preferenceItem}>
              <div className={styles.prefText}>
                <span className={styles.prefTitle}>Automatic Backup</span>
                <span className={styles.prefSub}>Run server backups daily at midnight.</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" className={styles.toggleInput} defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.preferenceItem}>
              <div className={styles.prefText}>
                <span className={styles.prefTitle}>Email Notifications</span>
                <span className={styles.prefSub}>Send automated emails for fee dues.</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" className={styles.toggleInput} defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.preferenceItem}>
              <div className={styles.prefText}>
                <span className={styles.prefTitle}>Two-Factor Authentication</span>
                <span className={styles.prefSub}>Require OTP for admin logins.</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" className={styles.toggleInput} />
                <span className={styles.slider}></span>
              </label>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
