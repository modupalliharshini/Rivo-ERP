'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, ChevronDown, Plus, Pencil } from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { createClient } from '@/utils/supabase/client';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  institution_id: string | null;
  created_at: string;
  institution?: { id: string; name: string } | null;
}

type Institution = { id: string; name: string };

export default function GlobalUsers() {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*, institution:institutions!profiles_institution_id_fkey(id, name)')
      .order('created_at', { ascending: false });

    if (!error && data) setUsers(data as Profile[]);
    setIsLoading(false);
  };

  const fetchInstitutions = async () => {
    const { data } = await supabase.from('institutions').select('id, name').order('name');
    setInstitutions(data || []);
  };

  useEffect(() => {
    fetchUsers();
    fetchInstitutions();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredUsers = users.filter(user => {
    const displayRole = user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const matchesRole = selectedRole === 'All Roles' || displayRole.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesInstitution = !selectedInstitution || user.institution_id === selectedInstitution;
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesInstitution && matchesSearch;
  });

  const getInitials = (first: string, last: string) =>
    `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

  const getDisplayRole = (role: string) =>
    role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));

  const selectStyle = {
    appearance: 'none' as const, border: 'none', background: 'transparent',
    fontSize: '0.9rem', color: '#1e293b', paddingRight: '1.5rem', cursor: 'pointer', outline: 'none', zIndex: 2
  };
  const selectWrapper = {
    position: 'relative' as const, display: 'flex', alignItems: 'center',
    border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 1rem', background: 'white', height: '40px'
  };

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Global" highlight="Users" />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className={sectionStyles.cardTitle}>User Directory</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>

            {/* Role filter */}
            <div style={selectWrapper}>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={selectStyle}>
                <option>All Roles</option>
                <option>Admin</option>
                <option>Faculty</option>
                <option>Student</option>
                <option>Super Admin</option>
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
            </div>

            {/* Institution filter */}
            <div style={selectWrapper}>
              <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} style={selectStyle}>
                <option value="">All Institutions</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
            </div>

            <div className={sectionStyles.searchGroup} style={{ height: '40px' }}>
              <input type="text" placeholder="Search users..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <button className={sectionStyles.btnPost}
              style={{ height: '40px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} /> Add New User
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
                <th>Institution</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading users...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.first_name} {user.last_name}</span>
                    </div>
                  </td>
                  <td>{user.email.endsWith('@rivo.local') ? user.email.replace('@rivo.local', '') : user.email}</td>
                  <td>{getDisplayRole(user.role)}</td>
                  <td>{user.institution?.name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles.active}`}>Active</span>
                  </td>
                  <td style={{ position: 'relative' }}>
                    {user.role === 'super_admin' ? (
                      <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>—</span>
                    ) : (
                      <div ref={openMenuId === user.id ? menuRef : null} style={{ position: 'relative', display: 'inline-block' }}>
                        <button className={sectionStyles.tableActionBtn} title="Options"
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}>
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === user.id && (
                          <div style={{
                            position: 'absolute', right: 0, top: '110%', zIndex: 100,
                            background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '130px', overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => { setEditUser(user); setOpenMenuId(null); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                width: '100%', padding: '0.75rem 1rem', background: 'none',
                                border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b', fontWeight: 500
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                            >
                              <Pencil size={14} /> Edit User
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
                                  setOpenMenuId(null);
                                  const { error: delErr } = await supabase.functions.invoke('delete-user', {
                                    body: { targetUserId: user.id }
                                  });
                                  if (delErr) alert(delErr.message);
                                  else fetchUsers();
                                }
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                width: '100%', padding: '0.75rem 1rem', background: 'none',
                                border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444', fontWeight: 500
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                            >
                              <X size={14} /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && filteredUsers.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#64748b' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => { setIsAddModalOpen(false); fetchUsers(); }} />

      <EditUserModal user={editUser} isOpen={!!editUser} onClose={() => setEditUser(null)}
        onSuccess={() => { setEditUser(null); fetchUsers(); }} />
    </div>
  );
}
