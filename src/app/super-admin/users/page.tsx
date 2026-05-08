'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';

const INITIAL_USERS = [
  { id: 1, initials: 'JD', name: 'John Doe', role: 'Admin', institution: 'Greenwood High', lastLogin: 'Today, 10:45 AM', status: 'Active' },
  { id: 2, initials: 'EW', name: 'Emma Watson', role: 'Faculty', institution: 'St. Xavier\'s', lastLogin: 'Yesterday', status: 'Active' },
  { id: 3, initials: 'MR', name: 'Mike Ross', role: 'Student', institution: 'Sunshine Int.', lastLogin: '2 days ago', status: 'Suspended' },
  { id: 4, initials: 'AS', name: 'Alice Smith', role: 'Admin', institution: 'Oakridge', lastLogin: '3 hours ago', status: 'Active' },
  { id: 5, initials: 'BW', name: 'Bruce Wayne', role: 'Faculty', institution: 'Gotham Academy', lastLogin: 'Today, 9:20 AM', status: 'Active' },
];

export default function GlobalUsers() {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = INITIAL_USERS.filter(user => {
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Users" />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 className={sectionStyles.cardTitle}>User Directory</h3>
          <div style={{display: 'flex', gap: '1rem'}}>
             <div style={{position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 1rem', background: 'white', height: '40px'}}>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.9rem',
                    color: '#1e293b',
                    paddingRight: '1.5rem',
                    cursor: 'pointer',
                    outline: 'none',
                    zIndex: 2
                  }}
                >
                   <option>All Roles</option>
                   <option>Admin</option>
                   <option>Faculty</option>
                   <option>Student</option>
                </select>
                <ChevronDown size={14} color="#64748b" style={{position: 'absolute', right: '12px', pointerEvents: 'none'}} />
             </div>
             <div className={sectionStyles.searchGroup} style={{height: '40px'}}>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Institution</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <div style={{width: 36, height: 36, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', color: '#475569'}}>
                        {user.initials}
                      </div>
                      <span style={{fontWeight: '500'}}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td>{user.institution}</td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[user.status.toLowerCase()]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className={sectionStyles.tableActionBtn} title="Options">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#64748b'}}>No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
