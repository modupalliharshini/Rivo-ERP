import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.brand}>
          <Image 
            src="/logo.png" 
            alt="Rivo" 
            width={120} 
            height={80} 
            className={styles.logoImage} 
            priority
          />
          <h1>
            Welcome Back
          </h1>
          <p>Please sign in to access your portal</p>
        </div>
        <LoginForm />
        <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b'}}>
          Powered by <a href="https://pickmyschoolai.com/" target="_blank" rel="noopener noreferrer" style={{color: '#c91f28', fontWeight: '600'}}>Pick My School Ai</a>
        </div>
      </div>
    </main>
  );
}
