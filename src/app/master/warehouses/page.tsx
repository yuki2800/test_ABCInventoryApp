'use client';

import { useState, useEffect } from 'react';

type Warehouse = { id: string; name: string; maxCapacity: number };

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/master/warehouses')
      .then(r => r.json())
      .then(data => { setWarehouses(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">倉庫マスタ</h2>
          <p className="text-slate-500 mt-0.5">全 {warehouses.length} 件の倉庫が登録されています。</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規登録
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <svg className="w-8 h-8 mx-auto mb-3 animate-spin text-primary-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            読み込み中...
          </div>
        ) : warehouses.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            倉庫が登録されていません。
          </div>
        ) : (
          warehouses.map((w, i) => (
            <div key={w.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{String(i + 1).padStart(3, '0')}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-primary-700 transition-colors">{w.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                最大容量: <span className="font-mono font-semibold text-slate-700">{w.maxCapacity.toLocaleString()}</span> 個
              </div>

              <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex-1 py-1.5 text-xs text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg font-medium transition-colors">編集</button>
                <button className="flex-1 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors">削除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
