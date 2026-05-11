'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical,
  ChevronDown,
  Plus
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import AddUserModal from '../components/AddUserModal';
import { createClient } from '@/utils/supabase/client';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  institution_id: string | null;
  created_at: string;
}

export default function GlobalUsers() {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    // Normalise role to title case for filtering e.g. "super_admin" -> "Super Admin"
    const displayRole = user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const matchesRole = selectedRole === 'All Roles' || displayRole.toLowerCase().includes(selectedRole.toLowerCase());
    
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const getDisplayRole = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(new Date(dateString));
  };

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Users" />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <h3 className={sectionStyles.cardTitle}>User Directory</h3>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
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
                   <option>Super Admin</option>
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
             <button 
               className={sectionStyles.btnPost} 
               style={{ height: '40px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
               onClick={() => setIsModalOpen(true)}
              >
               <Plus size={18} />
               Add New User
             </button>
          </div>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>User ID / Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>Loading users...</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <div style={{width: 36, height: 36, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', color: '#475569'}}>
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <span style={{fontWeight: '500'}}>{user.first_name} {user.last_name}</span>
                    </div>
                  </td>
                  <td>{user.email.endsWith('@rivo.local') ? user.email.replace('@rivo.local', '') : user.email}</td>
                  <td>{getDisplayRole(user.role)}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles.active}`}>
                      Active
                    </span>
                  </td>
                  <td>
                    <button className={sectionStyles.tableActionBtn} title="Options">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#64748b'}}>No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          fetchUsers();
        }}
      />
    </div>
  );
}
