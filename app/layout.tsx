import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './_components/Sidebar';
import { Navbar } from './_components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'A modern admin panel built with Next.js and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1">
              <Navbar />
              <div className="p-8 fade-in">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
