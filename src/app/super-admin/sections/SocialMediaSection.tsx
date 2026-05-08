'use client';

import React from 'react';
import { Globe, Share2, Palette, CalendarCheck, Image as ImageIcon } from 'lucide-react';
import styles from './Sections.module.css';

export default function SocialMediaSection() {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.socialGrid}>
        {/* Facebook Card */}
        <div className={styles.platformCard}>
          <div className={styles.platformInfo}>
            <div className={styles.platformIcon} style={{backgroundColor: '#1877F2'}}>
              <Globe size={24} color="white" />
            </div>
            <div>
              <div className={styles.platformName}>Facebook Page</div>
              <div className={styles.connectedAccount}>Connected: Rivo ERP Official</div>
            </div>
          </div>
          <div className={styles.platformStatus}>
            <span className={styles.onlineBadge}>Online</span>
            <button className={styles.btnOutline}>Manage</button>
          </div>
        </div>

        {/* Instagram Card */}
        <div className={styles.platformCard}>
          <div className={styles.platformInfo}>
            <div className={styles.platformIcon} style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'}}>
              <Share2 size={24} color="white" />
            </div>
            <div>
              <div className={styles.platformName}>Instagram Business</div>
              <div className={styles.connectedAccount}>Connected: @rivoerp</div>
            </div>
          </div>
          <div className={styles.platformStatus}>
            <span className={styles.onlineBadge}>Online</span>
            <button className={styles.btnOutline}>Manage</button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className={styles.performanceCard}>
          <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Recent Performance</h3>
          <div className={styles.perfMetric}>
            <div className={styles.perfLabel}>Total Reach</div>
            <div className={styles.perfValue}>45.2K</div>
            <div className={`${styles.perfTrend} text-success`}>↑ 15%</div>
          </div>
          <div className={styles.perfMetric}>
            <div className={styles.perfLabel}>Engagements</div>
            <div className={styles.perfValue}>12.8K</div>
            <div className={`${styles.perfTrend} text-success`}>↑ 8%</div>
          </div>
        </div>
      </div>

      {/* Post Composer */}
      <div className={styles.masterPostCard}>
        <h3 className={styles.cardTitle}>Create Master Post</h3>
        <div className={styles.composerArea}>
          <textarea 
            className={styles.composerTextarea}
            placeholder="What's happening at your school?"
          ></textarea>
        </div>
        <div className={styles.composerActions}>
          <div className={styles.actionLeft}>
            <button className={styles.btnAction}><ImageIcon size={18} /> Photo/Video</button>
            <button className={styles.btnAction}><CalendarCheck size={18} /> Schedule</button>
          </div>
          <button className={styles.btnPost}>Post to All Channels</button>
        </div>
      </div>
    </div>
  );
}
