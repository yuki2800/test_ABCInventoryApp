'use client';

import { usePathname } from 'next/navigation';

const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  '/':                  { title: 'ダッシュボード' },
  '/master':            { title: 'マスタ管理' },
  '/master/products':   { title: '製品マスタ', parent: 'マスタ管理' },
  '/master/warehouses': { title: '倉庫マスタ', parent: 'マスタ管理' },
  '/history':           { title: '入出庫履歴' },
  '/settings':          { title: '設定' },
};

export default function Header() {
  const pathname = usePathname();
  const pageInfo = breadcrumbMap[pathname] ?? { title: 'ページ' };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left: Page title area */}
        <div className="flex items-center gap-3 pl-10 lg:pl-0">
          {/* Vertical accent bar */}
          <div className="w-1 h-7 bg-primary-700 rounded-sm" />
          <div>
            {pageInfo.parent && (
              <p className="text-xs text-gray-500 leading-none mb-0.5">
                {pageInfo.parent} &rsaquo;
              </p>
            )}
            <h1 className="text-xl font-bold text-gray-800 leading-none tracking-tight">
              {pageInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Date */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-100 border border-gray-300 px-3 py-1.5 rounded">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Notifications */}
          <button className="relative p-2 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-6 h-6 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold">
              管
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">管理者</span>
          </div>
        </div>
      </div>
    </header>
  );
}
