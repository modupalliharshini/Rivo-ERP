'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3
} from 'lucide-react';
import styles from '../page.module.css';
import sectionStyles from '../sections/Sections.module.css';
import SuperAdminHeader from '../../components/SuperAdminHeader';
import Modal from '../../dashboard/components/Modal';

const INITIAL_INSTITUTIONS = [
  { id: 1, name: 'Greenwood High School', location: 'Hyderabad', contact: 'smith@greenwood.com', status: 'Active', plan: 'Premium AI' },
  { id: 2, name: 'St. Xavier\'s College', location: 'Bangalore', contact: 'miller@stxaviers.edu', status: 'Active', plan: 'Standard' },
  { id: 3, name: 'Sunshine International', location: 'Delhi', contact: 'garcia@sunshine.ac.in', status: 'Expiring', plan: 'Basic' },
  { id: 4, name: 'Oakridge School', location: 'Mumbai', contact: 'wilson@oakridge.edu', status: 'Active', plan: 'Enterprise' },
];

export default function InstitutionsManagement() {
  const [institutions, setInstitutions] = useState(INITIAL_INSTITUTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState({
    name: '',
    location: '',
    contact: '',
    plan: 'Standard',
    status: 'Active'
  });

  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    const institutionWithId = {
      ...newInstitution,
      id: Date.now()
    };
    setInstitutions([institutionWithId, ...institutions]);
    setIsModalOpen(false);
    setNewInstitution({ name: '', location: '', contact: '', plan: 'Standard', status: 'Active' });
  };

  const addBtn = (
    <button 
      className={sectionStyles.btnPost} 
      onClick={() => setIsModalOpen(true)}
      style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer'}}
    >
       <Plus size={20} /> Add Institution
    </button>
  );

  return (
    <div className={styles.pageWrapper}>
      <SuperAdminHeader title="Institutions" highlight="Management" actionElement={addBtn} />

      <div className={sectionStyles.sectionContainer}>
        <div className={sectionStyles.cardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 className={sectionStyles.cardTitle}>All Partnered Institutions</h3>
          <div className={sectionStyles.searchGroup}>
            <input type="text" placeholder="Search institutions..." />
            <div className={sectionStyles.searchBtn}><Search size={20} /></div>
          </div>
        </div>

        <div className={sectionStyles.tableResponsive}>
          <table className={sectionStyles.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Location</th>
                <th>Admin Contact</th>
                <th>Status</th>
                <th>License Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((school) => (
                <tr key={school.id}>
                  <td>{school.name}</td>
                  <td>{school.location}</td>
                  <td>{school.contact}</td>
                  <td>
                    <span className={`${sectionStyles.statusBadge} ${sectionStyles[school.status.toLowerCase()]}`}>
                      {school.status}
                    </span>
                  </td>
                  <td>{school.plan}</td>
                  <td>
                    <button className={sectionStyles.tableActionBtn} title="Edit Institution">
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Institution"
      >
        <form className="erp-form" onSubmit={handleAddInstitution}>
          <div className="erp-form-group">
            <label>Institution Name</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Harvard University"
              required
              value={newInstitution.name}
              onChange={(e) => setNewInstitution({...newInstitution, name: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Location (City)</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. New York"
                required
                value={newInstitution.location}
                onChange={(e) => setNewInstitution({...newInstitution, location: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Admin Contact Email</label>
              <input
                className="erp-input"
                type="email"
                placeholder="admin@school.com"
                required
                value={newInstitution.contact}
                onChange={(e) => setNewInstitution({...newInstitution, contact: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group" style={{flex: 1}}>
              <label>License Plan</label>
              <select
                className="erp-select"
                value={newInstitution.plan}
                onChange={(e) => setNewInstitution({...newInstitution, plan: e.target.value})}
              >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium AI">Premium AI</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div className="erp-form-group" style={{flex: 1}}>
              <label>Account Status</label>
              <select
                className="erp-select"
                value={newInstitution.status}
                onChange={(e) => setNewInstitution({...newInstitution, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Expiring">Expiring</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Save Institution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
