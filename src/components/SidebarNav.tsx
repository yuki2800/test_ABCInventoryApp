'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  {
    label: 'ダッシュボード',
    href: '/',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'マスタ管理',
    href: '/master',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    children: [
      { label: '製品マスタ', href: '/master/products' },
      { label: '倉庫マスタ', href: '/master/warehouses' },
    ],
  },
  {
    label: '入出庫履歴',
    href: '/history',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: '設定',
    href: '/settings',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['/master']);

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-4 py-4 border-b border-primary-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-primary-800 font-black text-xs tracking-tight">ABC</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">在庫管理システム</p>
            <p className="text-primary-300 text-xs">ABC Inventory</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <p className="text-primary-400 text-xs font-bold uppercase tracking-widest px-4 py-2">
          メニュー
        </p>
        {navItems.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-900 text-white border-l-4 border-primary-400'
                      : 'text-primary-200 hover:bg-primary-900/60 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive(item.href) ? 'text-primary-300' : 'text-primary-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  <svg
                    className={`w-3 h-3 text-primary-400 transition-transform duration-200 ${expandedItems.includes(item.href) ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedItems.includes(item.href) && (
                  <div className="bg-primary-950/50">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 pl-10 pr-4 py-2 text-sm transition-colors ${
                          pathname === child.href
                            ? 'bg-primary-800 text-white font-medium border-l-4 border-primary-400'
                            : 'text-primary-300 hover:bg-primary-900/60 hover:text-white border-l-4 border-transparent'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${pathname === child.href ? 'bg-primary-400' : 'bg-primary-600'}`} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-900 text-white border-l-4 border-primary-400'
                    : 'text-primary-200 hover:bg-primary-900/60 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className={isActive(item.href) ? 'text-primary-300' : 'text-primary-400'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-primary-900 bg-primary-950">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary-400 flex items-center justify-center text-primary-900 text-xs font-bold">
            管
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary-100 text-xs font-semibold truncate">管理者</p>
            <p className="text-primary-400 text-xs truncate">admin@abc.co.jp</p>
          </div>
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        id="sidebar-toggle"
        className="fixed top-3.5 left-4 z-50 lg:hidden p-2 rounded bg-primary-800 text-white hover:bg-primary-700 transition-colors shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-primary-950 min-h-screen sticky top-0 h-screen overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-56 z-40 bg-primary-950 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
