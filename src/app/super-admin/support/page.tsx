'use client';

import React from 'react';
import { 
  BarChart2, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';

const TICKETS = [
  { id: '#T-904', subject: 'API Integration Error', institution: 'Greenwood High', priority: 'Urgent', status: 'In Progress' },
  { id: '#T-899', subject: 'Faculty Access Issue', institution: 'Oakridge', priority: 'Medium', status: 'Open' },
  { id: '#T-882', subject: 'Monthly Report Bug', institution: 'St. Xavier\'s', priority: 'Low', status: 'Resolved' },
];

const STATS = [
  { 
    label: 'Open Tickets', 
    value: '12', 
    trend: '4 Urgent', 
    trendColor: '#ef4444',
    bg: '#eff6ff',
    icon: Clock,
    iconColor: '#3b82f6'
  },
  { 
    label: 'Resolved Today', 
    value: '45', 
    trend: 'Avg reset time: 2h', 
    trendColor: '#64748b',
    bg: '#f0fdf4',
    icon: CheckCircle,
    iconColor: '#22c55e'
  },
  { 
    label: 'Pending Approval', 
    value: '3', 
    trend: 'Resource allocation', 
    trendColor: '#64748b',
    bg: '#fffbeb',
    icon: BarChart2,
    iconColor: '#eab308'
  },
];

export default function TicketingSupport() {
  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Ticketing" highlight="Support" />

      <div className={sectionStyles.statsGrid} style={{marginBottom: '2rem'}}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={sectionStyles.statCard} style={{background: stat.bg}}>
              <div className={sectionStyles.statHeader}>
                <span className={sectionStyles.statLabel}>{stat.label}</span>
                <div style={{width: 40, height: 40, borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon size={20} color={stat.iconColor} />
                </div>
              </div>
              <div className={sectionStyles.statValue}>{stat.value}</div>
              <div style={{fontSize: '0.85rem', color: stat.trendColor, marginTop: '0.5rem', fontWeight: '500'}}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{marginBottom: '1.5rem'}}>
          <h3 className={sectionStyles.cardTitle}>Recent Support Requests</h3>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Institution</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((ticket) => (
                <tr key={ticket.id}>
                  <td style={{fontWeight: '600'}}>{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.institution}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[ticket.priority.toLowerCase()]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[ticket.status.toLowerCase().replace(' ', '')]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <button className={sectionStyles.btnLink} style={{color: '#3b82f6', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer'}}>
                      View
                    </button>
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
