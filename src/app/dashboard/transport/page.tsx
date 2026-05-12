'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, Truck, User, Users, AlertCircle } from 'lucide-react';

const INITIAL_ROUTES = [
  { id: 1, route: 'Madhapur - HI-TECH City', bus: 'Bus #01', driver: 'Ravi Kumar', students: 45, status: 'On Route' },
  { id: 2, route: 'Gachibowli - Kondapur', bus: 'Bus #05', driver: 'Suresh Singh', students: 38, status: 'Delayed' },
  { id: 3, route: 'Banjara Hills', bus: 'Bus #08', driver: 'Mohd. Ali', students: 42, status: 'At School' },
];

export default function TransportPage() {
  const [routeList, setRouteList] = useState(INITIAL_ROUTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route: '',
    bus: '',
    driver: '',
    students: '',
    status: 'At School'
  });

  const totalBuses = routeList.length + 9; // Mocking a total of 12 for the stat card
  const totalBusStudents = routeList.reduce((sum, r) => sum + r.students, 0) + 715; // Mocking a total of 840

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      id: routeList.length + 1,
      route: newRoute.route,
      bus: newRoute.bus,
      driver: newRoute.driver,
      students: parseInt(newRoute.students),
      status: newRoute.status
    };

    setRouteList([record, ...routeList]);
    setIsModalOpen(false);
    setNewRoute({ route: '', bus: '', driver: '', students: '', status: 'At School' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Transport"
        titleHighlight="Management"
        actionElement={
          <button className="btn-info" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Route
          </button>
        }
      />

      <section className={`${styles.tableCard} card-shadow`}>
        <div className={styles.comingSoonContainer}>
          <div className={styles.comingSoonIcon}>
            <AlertCircle size={64} color="#f59e0b" />
          </div>
          <h2>Transport Management System Coming Soon</h2>
          <p>We are currently integrating live GPS tracking and automated route optimization. Soon you will be able to monitor vehicle health, track bus locations in real-time, and manage student pick-up/drop-off schedules dynamically.</p>
          <div className={styles.comingSoonAction}>
            <span className={styles.maintenanceBadge}>
              System Under Upgrade
            </span>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Transport Route"
      >
        <form className="erp-form" onSubmit={handleAddRoute}>
          <div className="erp-form-group">
            <label>Route Area / Path</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Jubilee Hills - Hitech City"
              required
              value={newRoute.route}
              onChange={(e) => setNewRoute({...newRoute, route: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Bus Number</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. Bus #12"
                required
                value={newRoute.bus}
                onChange={(e) => setNewRoute({...newRoute, bus: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Driver Name</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. John Doe"
                required
                value={newRoute.driver}
                onChange={(e) => setNewRoute({...newRoute, driver: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Student Count</label>
              <input
                className="erp-input"
                type="number"
                placeholder="e.g. 40"
                required
                value={newRoute.students}
                onChange={(e) => setNewRoute({...newRoute, students: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>Current Status</label>
              <select
                className="erp-select"
                value={newRoute.status}
                onChange={(e) => setNewRoute({...newRoute, status: e.target.value})}
              >
                <option value="At School">At School</option>
                <option value="On Route">On Route</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Register Route
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
