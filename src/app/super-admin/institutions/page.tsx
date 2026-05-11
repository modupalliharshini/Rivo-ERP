'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3 } from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import AddInstitutionModal from '../components/AddInstitutionModal';
import EditInstitutionModal from '../components/EditInstitutionModal';
import { createClient } from '@/utils/supabase/client';

type Institution = {
  id: string;
  name: string;
  location: string;
  plan: string;
  status: string;
  admin_id: string | null;
  created_at: string;
  admin?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
};

export default function InstitutionsManagement() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null);

  const supabase = createClient();

  const fetchInstitutions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('institutions')
      .select(`
        id, name, location, plan, status, admin_id, created_at,
        admin:profiles!institutions_admin_id_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInstitutions(data as unknown as Institution[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const filtered = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAdminDisplay = (inst: Institution) => {
    if (!inst.admin) return <span style={{ color: '#94a3b8' }}>— Not Assigned</span>;
    const name = `${inst.admin.first_name || ''} ${inst.admin.last_name || ''}`.trim();
    const id = inst.admin.email?.replace('@rivo.local', '');
    return name ? `${name} (${id})` : id;
  };

  const addBtn = (
    <button
      className={sectionStyles.btnPost}
      onClick={() => setIsAddOpen(true)}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
    >
      <Plus size={20} /> Add Institution
    </button>
  );

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Institutions" highlight="Management" actionElement={addBtn} />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className={sectionStyles.cardTitle}>All Partnered Institutions</h3>
          <div className={sectionStyles.searchGroup}>
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className={sectionStyles.searchBtn}><Search size={18} /></div>
          </div>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Location</th>
                <th>Assigned Admin</th>
                <th>Status</th>
                <th>License Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading institutions...</td>
                </tr>
              ) : filtered.map((inst) => (
                <tr key={inst.id}>
                  <td style={{ fontWeight: 600 }}>{inst.name}</td>
                  <td>{inst.location || '—'}</td>
                  <td>{getAdminDisplay(inst)}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[inst.status?.toLowerCase() || 'active']}`}>
                      {inst.status || 'Active'}
                    </span>
                  </td>
                  <td>{inst.plan || '—'}</td>
                  <td>
                    <button
                      className={sectionStyles.tableActionBtn}
                      title="Edit Institution"
                      onClick={() => setEditInstitution(inst)}
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {searchQuery ? 'No institutions match your search.' : 'No institutions yet. Click "Add Institution" to get started!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddInstitutionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { setIsAddOpen(false); fetchInstitutions(); }}
      />

      <EditInstitutionModal
        institution={editInstitution}
        isOpen={!!editInstitution}
        onClose={() => setEditInstitution(null)}
        onSuccess={() => { setEditInstitution(null); fetchInstitutions(); }}
      />
    </div>
  );
}
