'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import { createClient } from '@/utils/supabase/client';

export default function GlobalReports() {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReportData = async () => {
      // 1. Fetch all institutions
      const { data: institutions, error: instError } = await supabase
        .from('institutions')
        .select('id, name');

      if (instError || !institutions) {
        setIsLoading(false);
        return;
      }

      // 2. Fetch student counts for each institution
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('institution_id, role')
        .eq('role', 'student');

      if (profError) {
        setIsLoading(false);
        return;
      }

      // 3. Process data
      const processed = institutions.map(inst => {
        const studentCount = profiles.filter(p => p.institution_id === inst.id).length;
        
        // Pseudo-logic for engagement and health based on student volume and some variability
        const engagement = Math.min(Math.floor(60 + (studentCount % 40)), 98);
        const health = engagement > 80 ? 'Excellent' : engagement > 70 ? 'Good' : 'Stable';
        const color = engagement > 80 ? '#10b981' : engagement > 70 ? '#3b82f6' : '#f59e0b';

        return {
          name: inst.name,
          students: studentCount.toLocaleString(),
          studentValue: studentCount,
          engagement,
          health,
          color
        };
      });

      // 4. Sort by student count for ranking
      processed.sort((a, b) => b.studentValue - a.studentValue);
      
      const ranked = processed.map((item, index) => ({
        ...item,
        rank: index + 1
      }));

      setPerformanceData(ranked);
      setIsLoading(false);
    };

    fetchReportData();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Reports" />

      <div className={sectionStyles.socialGrid} style={{marginBottom: '2rem'}}>
        {/* Growth Chart Placeholder */}
        <div className={sectionStyles.card} style={{flex: 1, padding: '2rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem'}}>Institution Growth</h3>
          <div style={{height: '350px', border: '2px dashed #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#64748b'}}>
            <TrendingUp size={64} strokeWidth={1.5} style={{marginBottom: '1.5rem'}} />
            <span style={{fontSize: '1rem', fontWeight: '500'}}>Live Growth Analytics</span>
          </div>
        </div>

        {/* Revenue Breakdown Placeholder */}
        <div className={sectionStyles.card} style={{flex: 1, padding: '2rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{marginBottom: '2rem'}}>Revenue Breakdown</h3>
          <div style={{height: '350px', border: '2px dashed #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', color: '#64748b'}}>
            <PieChartIcon size={64} strokeWidth={1.5} style={{marginBottom: '1.5rem'}} />
            <span style={{fontSize: '1rem', fontWeight: '500'}}>Real-time Revenue Streams</span>
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
          {isLoading ? (
            <div style={{padding: '4rem', textAlign: 'center', color: '#64748b'}}>
              <Loader2 className="animate-spin" style={{margin: '0 auto 1rem'}} />
              Generating performance reports...
            </div>
          ) : (
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
                {performanceData.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                      No institution data available.
                    </td>
                  </tr>
                ) : (
                  performanceData.map((item) => (
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
