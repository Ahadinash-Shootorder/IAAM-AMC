import React from 'react';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';
import RegisterForm from './RegisterForm';
import { readPageSectionData } from '@/lib/data';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nomination Form - Advanced Materials Congress',
  description: 'Submit your nomination for the Advanced Materials Congress and join our community of leading researchers.',
};

export default async function RegisterPage() {
  const headerData = await readPageSectionData('global', 'header');
  const footerData = await readPageSectionData('global', 'footer');

  return (
    <div className={styles.registerPage}>
      <Header data={headerData} />
      
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          {/* Header Area */}
          <div className={styles.headerArea}>
            <h4 className={styles.subtitle}>Get Started</h4>
            <h1 className={styles.title}>Advance material Congress Nomination Form</h1>
          </div>

          {/* Form component */}
          <RegisterForm />
        </div>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
