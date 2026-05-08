'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, Book, User, Hash } from 'lucide-react';

const INITIAL_BOOKS = [
  { id: 1, title: 'Clean Code', student: 'Alex Johnson', issue: 'Oct 15, 2026', due: 'Oct 22, 2026', status: 'Returned' },
  { id: 2, title: 'Introduction to Algorithms', student: 'Maria Garcia', issue: 'Oct 20, 2026', due: 'Oct 27, 2026', status: 'Issued' },
  { id: 3, title: 'The Pragmatic Programmer', student: 'Liam Wilson', issue: 'Oct 10, 2026', due: 'Oct 17, 2026', status: 'Overdue' },
];

export default function LibraryPage() {
  const [bookList, setBookList] = useState(INITIAL_BOOKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science'
  });

  const handleRegisterBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the demo, we'll add the new book directly into the issues table 
    // as an "Available" book (or mock an issue if we want to show it in the table)
    // Since the table is "Book Issues", I'll mock an issue record for the new book.
    const record = {
      id: bookList.length + 1,
      title: newBook.title,
      student: 'N/A (Registered)',
      issue: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      due: '-',
      status: 'Returned' // Showing as returned = available in this UI context
    };

    setBookList([record, ...bookList]);
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', isbn: '', category: 'Computer Science' });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Library"
        titleHighlight="Management"
        actionElement={
          <button className="btn-info" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Book
          </button>
        }
      />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Books</div>
          <div className={styles.statValue}>{(15420 + bookList.length - 3).toLocaleString()}</div>
          <div className={`${styles.statSub} ${styles.subGreen}`}>Across 12 Categories</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Issued Books</div>
          <div className={styles.statValue}>412</div>
          <div className={`${styles.statSub} ${styles.subBlue}`}>85% return rate</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Overdue</div>
          <div className={styles.statValue}>15</div>
          <div className={`${styles.statSub} ${styles.subRed}`}>Needs attention</div>
        </div>
      </section>

      <section className={`${styles.tableCard} card-shadow`}>
        <h2 className={styles.tableTitle}>Recent Activity & Catalog</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Student Name</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookList.map((book) => (
              <tr key={book.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book.title}</td>
                <td>{book.student}</td>
                <td>{book.issue}</td>
                <td>{book.due}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      book.status === 'Returned'
                        ? styles.badgeReturned
                        : book.status === 'Issued'
                        ? styles.badgeIssued
                        : styles.badgeOverdue
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Library Book"
      >
        <form className="erp-form" onSubmit={handleRegisterBook}>
          <div className="erp-form-group">
            <label>Book Title</label>
            <div style={{ position: 'relative' }}>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. Clean Architecture"
                required
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Author Name</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. Robert C. Martin"
                required
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              />
            </div>
            <div className="erp-form-group">
              <label>ISBN Number</label>
              <input
                className="erp-input"
                type="text"
                placeholder="e.g. 978-0134494166"
                required
                value={newBook.isbn}
                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-group">
            <label>Category</label>
            <select
              className="erp-select"
              value={newBook.category}
              onChange={(e) => setNewBook({...newBook, category: e.target.value})}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Literature">Literature</option>
              <option value="Physics">Physics</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            * This book will be added to the library catalog as available.
          </p>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Register Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
