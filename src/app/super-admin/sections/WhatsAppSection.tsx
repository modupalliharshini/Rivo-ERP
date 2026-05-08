'use client';

import React from 'react';
import { Plus, MessageCircle, Settings, CheckCircle2 } from 'lucide-react';
import styles from './Sections.module.css';

const BROADCAST_LISTS = [
  { id: 1, name: 'Parents Group A', time: '10:45 AM', lastMsg: 'Monthly Newsletter sent...' },
  { id: 2, name: 'Faculty Announcements', time: 'Yesterday', lastMsg: 'Meeting scheduled at 4PM' },
];

export default function WhatsAppSection() {
  return (
    <div className={styles.whatsappLayout}>
      <div className={styles.broadcastSidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.profileText}>
            <div className={styles.avatar} style={{width: 32, height: 32}}>SA</div>
            <span className={styles.userName} style={{fontSize: '0.9rem', marginLeft: '0.5rem'}}>Broadcast Lists</span>
          </div>
          <Plus size={20} className={styles.textSecondary} style={{cursor: 'pointer'}} />
        </div>
        <div className={styles.broadcastList}>
          {BROADCAST_LISTS.map((list) => (
            <div key={list.id} className={styles.broadcastItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemName}>{list.name}</span>
                <span className={styles.itemTime}>{list.time}</span>
              </div>
              <div className={styles.itemPreview}>{list.lastMsg}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.mainApiArea}>
        <div className={styles.apiCard}>
          <div className={styles.apiIcon}>
            <MessageCircle size={40} fill="#25d366" color="white" />
          </div>
          <h2 className={styles.apiTitle}>WhatsApp API Dashboard</h2>
          <p className={styles.apiDesc}>
            Communicate with students and parents directly through our integrated API. 
            Manage broadcasts, automated alerts, and real-time support.
          </p>
          <button className={`${styles.btnPost} ${styles.btnWhatsapp}`}>
            Configure API
          </button>
        </div>
      </div>
    </div>
  );
}
