'use client';

import React from 'react';
import { 
  Download,
  ShieldCheck,
  AlertTriangle,
  History
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';

const LOGS = [
  { timestamp: '2026-03-28 10:15:32', user: 'Super Admin', action: 'Added Institution', target: 'Oakridge School', ip: '192.168.1.45', status: 'Success' },
  { timestamp: '2026-03-28 09:42:11', user: 'smith@greenwood.com', action: 'Login', target: 'Admin Dashboard', ip: '103.22.11.5', status: 'Success' },
  { timestamp: '2026-03-28 09:12:05', user: 'Unknown User', action: 'Failed Login', target: 'Super Admin Portal', ip: '184.22.45.1', status: 'Denied' },
  { timestamp: '2026-03-27 18:22:15', user: 'Super Admin', action: 'Modified License', target: 'Sunshine Int.', ip: '192.168.1.45', status: 'Success' },
];

export default function AuditLogs() {
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
              {LOGS.map((log, index) => (
                <tr key={index}>
                  <td style={{color: '#64748b', fontSize: '0.9rem'}}>{log.timestamp}</td>
                  <td style={{fontWeight: '500'}}>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.target}</td>
                  <td style={{fontFamily: 'monospace', fontSize: '0.9rem', color: '#64748b'}}>{log.ip}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[log.status.toLowerCase()]}`}>
                       {log.status === 'Success' ? <ShieldCheck size={14} style={{marginRight: '0.25rem'}} /> : <AlertTriangle size={14} style={{marginRight: '0.25rem'}} />}
                       {log.status}
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
