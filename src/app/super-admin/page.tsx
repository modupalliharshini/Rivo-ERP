'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  MessageSquare, 
  Share2, 
  Palette
} from 'lucide-react';
import styles from './page.module.css';
import ERPSection from './sections/ERPSection';
import WhatsAppSection from './sections/WhatsAppSection';
import SocialMediaSection from './sections/SocialMediaSection';
import CanvasSection from './sections/CanvasSection';
import SuperAdminHeader from '../components/SuperAdminHeader';

type DashboardTab = 'ERP' | 'Canvas' | 'Whatsapp' | 'Social Media';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('ERP');

  const renderSection = () => {
    switch (activeTab) {
      case 'ERP':
        return <ERPSection />;
      case 'Whatsapp':
        return <WhatsAppSection />;
      case 'Social Media':
        return <SocialMediaSection />;
      case 'Canvas':
        return <CanvasSection />;
      default:
        return <ERPSection />;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Super Admin" highlight="Overview" />

      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'ERP' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ERP')}
        >
          <BarChart size={18} /> ERP
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Canvas' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Canvas')}
        >
          <Palette size={18} /> Canvas
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Whatsapp' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Whatsapp')}
        >
          <MessageSquare size={18} /> Whatsapp
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Social Media' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Social Media')}
        >
          <Share2 size={18} /> Social Media
        </button>
      </div>

      <main className={styles.sectionContent}>
        {renderSection()}
      </main>
    </div>
  );
}
