import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from './components/ThemeProvider';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rivo ERP',
  description: 'Admin Dashboard for Rivo ERP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
