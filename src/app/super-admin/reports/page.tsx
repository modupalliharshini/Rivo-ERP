'use client';

import React from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Award
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';

const PERFORMANCE = [
  { rank: 1, name: 'Greenwood High School', students: '4,200', engagement: 85, health: 'Excellent', color: '#10b981' },
  { rank: 2, name: 'St. Xavier\'s College', students: '2,850', engagement: 65, health: 'Good', color: '#3b82f6' },
  { rank: 3, name: 'Oakridge School', students: '1,920', engagement: 45, health: 'Stable', color: '#f59e0b' },
];

export default function GlobalReports() {
  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Reports" />

      <div className={sectionStyles.socialGrid} style={{marginBottom: '2rem'}}>
        {/* Growth Chart Placeholder */}
        <div className={sectionStyles.card} style={{flex: 1, padding: '2rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem'}}>Institution Growth</h3>
          <div style={{height: '350px', border: '2px dashed #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#64748b'}}>
            <TrendingUp size={64} strokeWidth={1.5} style={{marginBottom: '1.5rem'}} />
            <span style={{fontSize: '1rem', fontWeight: '500'}}>Analytics Chart Placeholder</span>
          </div>
        </div>

        {/* Revenue Breakdown Placeholder */}
        <div className={sectionStyles.card} style={{flex: 1, padding: '2rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem'}}>Revenue Breakdown</h3>
          <div style={{height: '350px', border: '2px dashed #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#64748b'}}>
            <PieChartIcon size={64} strokeWidth={1.5} style={{marginBottom: '1.5rem'}} />
            <span style={{fontSize: '1rem', fontWeight: '500'}}>Revenue Chart Placeholder</span>
          </div>
        </div>
      </div>

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{marginBottom: '1.5rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
            <Award size={22} color="#f59e0b" /> Top Performing Institutions
          </h3>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th style={{width: '60px'}}>Rank</th>
                <th>Institution</th>
                <th>Active Students</th>
                <th style={{width: '250px'}}>User Engagement</th>
                <th>System Health</th>
              </tr>
            </thead>
            <tbody>
              {PERFORMANCE.map((item) => (
                <tr key={item.name}>
                  <td style={{fontWeight: '700', color: '#64748b'}}>{item.rank}</td>
                  <td style={{fontWeight: '600'}}>{item.name}</td>
                  <td>{item.students}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <div style={{flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden'}}>
                        <div style={{width: `${item.engagement}%`, height: '100%', background: item.color, borderRadius: '4px'}}></div>
                      </div>
                      <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#475569', minWidth: '35px'}}>{item.engagement}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${sectionStyles.statusBadge}`} style={{
                      background: item.health === 'Excellent' ? '#ecfdf5' : item.health === 'Good' ? '#eff6ff' : '#fffbeb',
                      color: item.health === 'Excellent' ? '#059669' : item.health === 'Good' ? '#2563eb' : '#d97706',
                      fontWeight: '700'
                    }}>
                      {item.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
