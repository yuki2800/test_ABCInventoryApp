'use client';

import { useState, useEffect } from 'react';

type Product = { id: string; name: string; category: string; price: number };

const categoryLabel: Record<string, { label: string; cls: string }> = {
  STANDARD:   { label: '通常品',   cls: 'bg-gray-100 text-gray-700 border-gray-300' },
  PERISHABLE: { label: '生鮮食品', cls: 'bg-green-100 text-green-800 border-green-300' },
  HAZARDOUS:  { label: '危険物',   cls: 'bg-red-100 text-red-800 border-red-300' },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/master/products')
      .then(r => r.json())
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header bar */}
      <div className="bg-white border border-gray-300 rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">
            マスタ管理 &rsaquo;
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">製品マスタ</h1>
          <p className="text-sm text-gray-500 mt-0.5">全 {products.length} 件の製品が登録されています。</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規登録
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-gray-300 bg-gray-50 flex items-center">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">製品一覧</span>
          <span className="ml-auto text-xs text-gray-400">{products.length} 件</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">読み込み中...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold text-xs border-b border-gray-300">
              <tr>
                <th className="px-5 py-3">製品名</th>
                <th className="px-5 py-3">カテゴリ</th>
                <th className="px-5 py-3 text-right">単価（円）</th>
                <th className="px-5 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400">製品が登録されていません。</td>
                </tr>
              ) : (
                products.map(p => {
                  const cat = categoryLabel[p.category] ?? { label: p.category, cls: 'bg-gray-100 text-gray-600 border-gray-300' };
                  return (
                    <tr key={p.id} className="hover:bg-primary-50/40 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${cat.cls}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-800 font-semibold">
                        {p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="px-3 py-1 text-xs text-primary-700 border border-primary-300 bg-primary-50 hover:bg-primary-100 rounded font-semibold transition-colors">
                            編集
                          </button>
                          <button className="px-3 py-1 text-xs text-red-700 border border-red-300 bg-red-50 hover:bg-red-100 rounded font-semibold transition-colors">
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
