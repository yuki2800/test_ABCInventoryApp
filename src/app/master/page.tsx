'use client';

import Link from 'next/link';

const masterCards = [
  {
    title: '製品マスタ',
    description: '製品情報の登録・編集・削除を行います。カテゴリ別（通常品・生鮮食品・危険物）の管理が可能です。',
    href: '/master/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    accentColor: 'bg-primary-700',
    badge: '製品',
  },
  {
    title: '倉庫マスタ',
    description: '倉庫情報の登録・編集・削除を行います。各倉庫の最大キャパシティを設定できます。',
    href: '/master/warehouses',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    accentColor: 'bg-primary-700',
    badge: '倉庫',
  },
];

export default function MasterPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header bar */}
      <div className="bg-white border border-gray-300 rounded px-5 py-4">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">システム管理</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">マスタ管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">製品・倉庫などのマスタデータを管理します。</p>
      </div>

      {/* Card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {masterCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white border border-gray-300 rounded hover:border-primary-400 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className={`h-1 ${card.accentColor}`} />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded ${card.accentColor} text-white shrink-0`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{card.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-primary-700">
                <span>管理画面を開く</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
