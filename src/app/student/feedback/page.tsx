'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    setIsSubmitted(true);
    setComments('');
    setRating(3);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className={styles.main}>
      <PageHeader 
        titleStart="Give" 
        titleHighlight="Feedback" 
      />

      <section className={styles.formCard}>
        <h2 className={styles.cardTitle}>Course Feedback Form</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Select Course</label>
          <select className={styles.selectInput} defaultValue="cs101">
            <option value="cs101">Computer Science 101</option>
            <option value="ds301">Advanced Data Structures</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Rating</label>
          <div className={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                type="button" 
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => setRating(star)}
              >
                <Star 
                  size={24} 
                  className={star <= rating ? styles.starFilled : styles.starOutline} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Comments</label>
          <textarea 
            className={styles.textArea} 
            placeholder="Write your feedback..." 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit Feedback
          </button>
          {isSubmitted && <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}>Feedback submitted successfully!</span>}
        </div>
      </section>

      <div className={styles.backLinkContainer}>
        <Link href="/student" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
