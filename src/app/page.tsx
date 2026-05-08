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
      </div>
    </main>
  );
}
