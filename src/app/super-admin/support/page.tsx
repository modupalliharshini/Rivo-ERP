'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import { createClient } from '@/utils/supabase/client';

export default function GlobalTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    open: 0,
    urgent: 0,
    resolved: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const loadData = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTickets(data);
      const openCount = data.filter(t => t.status !== 'Resolved').length;
      const urgentCount = data.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
      const resolvedCount = data.filter(t => t.status === 'Resolved').length;
      const pendingCount = data.filter(t => t.status === 'In Progress').length;
      
      setStats({ open: openCount, urgent: urgentCount, resolved: resolvedCount, pending: pendingCount });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      await loadData();
    }
    setUpdatingId(null);
  };

  const STATS_CARDS = [
    { 
      label: 'Open Tickets', 
      value: stats.open.toString(), 
      trend: `${stats.urgent} Urgent`, 
      trendColor: '#ef4444',
      bg: '#eff6ff',
      icon: Clock,
      iconColor: '#3b82f6'
    },
    { 
      label: 'Resolved Globally', 
      value: stats.resolved.toString(), 
      trend: 'Lifetime total', 
      trendColor: '#64748b',
      bg: '#f0fdf4',
      icon: CheckCircle,
      iconColor: '#22c55e'
    },
    { 
      label: 'In Progress', 
      value: stats.pending.toString(), 
      trend: 'Active resolution', 
      trendColor: '#64748b',
      bg: '#fffbeb',
      icon: AlertTriangle,
      iconColor: '#eab308'
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Tickets" />

      <div className={sectionStyles.statsGrid} style={{marginBottom: '2rem'}}>
        {STATS_CARDS.map((stat) => {
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
          <h3 className={sectionStyles.cardTitle}>Global Support Activity</h3>
        </div>

        {isLoading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>Loading global activity...</div>
        ) : (
          <div className={sectionStyles.tableResponsive}>
            <table className={sectionStyles.table}>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Update Action</th>
                  <th>Raised At</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                      No global tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td style={{fontWeight: '600', fontSize: '0.8rem'}}>#{ticket.id.split('-')[0].toUpperCase()}</td>
                      <td>{ticket.subject}</td>
                      <td>
                        <span className={`${sectionStyles.statusBadge} ${sectionStyles[ticket.priority.toLowerCase()] || sectionStyles.medium}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`${sectionStyles.statusBadge} ${sectionStyles[ticket.status.toLowerCase().replace(' ', '')] || sectionStyles.open}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                          <select 
                            className={sectionStyles.btnSecondary}
                            style={{padding: '4px 8px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid #e2e8f0'}}
                            value={ticket.status}
                            disabled={updatingId === ticket.id}
                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                          >
                            <option value="Open">Set Open</option>
                            <option value="In Progress">Set In Progress</option>
                            <option value="Resolved">Set Resolved</option>
                          </select>
                        </div>
                      </td>
                      <td style={{color: '#64748b', fontSize: '0.85rem'}}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
