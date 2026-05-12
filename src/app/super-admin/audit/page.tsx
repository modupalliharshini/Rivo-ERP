'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download,
  ShieldCheck,
  AlertTriangle,
  History,
  Loader2
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import { createClient } from '@/utils/supabase/client';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLogs(data);
      }
      setIsLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Audit" highlight="Logs" />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 className={sectionStyles.cardTitle} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <History size={20} color="#64748b" /> Activity History
          </h3>
          <button className={sectionStyles.btnOutline} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#fee2e2'}}>
             <Download size={18} /> Export Logs
          </button>
        </div>

        <div className={sectionStyles.tableResponsive}>
          {isLoading ? (
            <div style={{padding: '4rem', textAlign: 'center', color: '#64748b'}}>
              <Loader2 className="animate-spin" style={{margin: '0 auto 1rem'}} />
              Loading system activity...
            </div>
          ) : (
            <table className={sectionStyles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{color: '#64748b', fontSize: '0.9rem'}}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{fontWeight: '500'}}>{log.user_email || 'System'}</td>
                      <td>{log.action}</td>
                      <td>{log.target || '-'}</td>
                      <td style={{fontFamily: 'monospace', fontSize: '0.9rem', color: '#64748b'}}>
                        {log.ip_address || '-'}
                      </td>
                      <td>
                        <span className={`${sectionStyles.statusBadge} ${sectionStyles[log.status.toLowerCase()] || sectionStyles.success}`}>
                           {log.status === 'Denied' || log.status === 'Failed' ? 
                             <AlertTriangle size={14} style={{marginRight: '0.25rem'}} /> : 
                             <ShieldCheck size={14} style={{marginRight: '0.25rem'}} />
                           }
                           {log.status}
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
