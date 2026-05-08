'use client';

import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';

const ASSIGNMENTS_DATA = [
  {
    id: 1,
    dueDate: 'DUE IN 2 DAYS',
    title: "Dijkstra's Algorithm Implementation",
    details: 'Advanced Data Structures • Dr. Alan Turing',
    theme: 'Red',
    actionText: 'Submit Now',
    isPrimaryAction: true
  },
  {
    id: 2,
    dueDate: 'DUE IN 5 DAYS',
    title: 'Quantum Tunneling Research Paper',
    details: 'Quantum Mechanics • Prof. Richard Feynman',
    theme: 'Yellow',
    actionText: 'View Details',
    isPrimaryAction: false
  },
  {
    id: 3,
    dueDate: 'DUE NEXT WEEK',
    title: 'Probability Distribution Exercises',
    details: 'Discrete Mathematics • Dr. Grace Hopper',
    theme: 'Blue',
    actionText: 'View Details',
    isPrimaryAction: false
  }
];

export default function AssignmentsPage() {
  const ToggleElement = (
    <div className={styles.toggleGroup}>
      <button className={`${styles.toggleBtn} ${styles.active}`}>Active</button>
      <button className={styles.toggleBtn}>Completed</button>
    </div>
  );

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="My" 
        titleHighlight="Assignments" 
        actionElement={ToggleElement}
      />

      <section className={styles.assignmentList}>
        {ASSIGNMENTS_DATA.map((assignment) => (
          <div key={assignment.id} className={`${styles.card} ${styles[`card${assignment.theme}`]}`}>
            <div className={styles.info}>
              <span className={`${styles.dueText} ${styles[`text${assignment.theme}`]}`}>
                {assignment.dueDate}
              </span>
              <h3 className={styles.title}>{assignment.title}</h3>
              <p className={styles.details}>{assignment.details}</p>
            </div>
            <button className={`${styles.actionBtn} ${assignment.isPrimaryAction ? styles.btnPrimary : styles.btnOutline}`}>
              {assignment.actionText}
            </button>
          </div>
        ))}
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
