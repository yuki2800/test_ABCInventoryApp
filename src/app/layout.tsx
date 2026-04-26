import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SidebarNav from '@/components/SidebarNav';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'ABC Inventory Management System',
  description: 'モダンでクリーンな在庫管理システム — Clean Architecture & DDD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans bg-gray-100 text-gray-900 min-h-screen antialiased">
        <div className="flex min-h-screen">
          {/* Left Sidebar */}
          <SidebarNav />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-5 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
