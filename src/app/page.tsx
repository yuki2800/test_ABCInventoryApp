'use client';

import { useState, useEffect, useMemo } from 'react';

// Domain Types
type InventoryDetail = {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  expirationDate?: string;
  productName: string;
  category: 'STANDARD' | 'PERISHABLE' | 'HAZARDOUS';
  warehouseName: string;
};

type Product = { id: string; name: string; category: string; price: number };
type Warehouse = { id: string; name: string; maxCapacity: number };

export default function Dashboard() {
  const [inventories, setInventories] = useState<InventoryDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalType, setModalType] = useState<'RECEIVE' | 'ISSUE' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [extraInfo, setExtraInfo] = useState(''); // expirationDate or safetyApproval
  const [actionError, setActionError] = useState('');

  const loadData = async () => {
    try {
      const [invRes, prodRes, whRes] = await Promise.all([
        fetch('/api/inventory').then(r => r.json()),
        fetch('/api/master/products').then(r => r.json()),
        fetch('/api/master/warehouses').then(r => r.json()),
      ]);
      setInventories(invRes || []);
      setProducts(prodRes || []);
      setWarehouses(whRes || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventories.filter(inv => {
      const matchesText = inv.productName.toLowerCase().includes(search.toLowerCase()) ||
                          inv.warehouseName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filterCategory || inv.category === filterCategory;
      const matchesWarehouse = !filterWarehouse || inv.warehouseId === filterWarehouse;
      return matchesText && matchesCategory && matchesWarehouse;
    });
  }, [inventories, search, filterCategory, filterWarehouse]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    const endpoint = modalType === 'RECEIVE' ? '/api/inventory' : '/api/inventory/issue';
    
    // Categorize extra info based on product category
    const product = products.find(p => p.id === selectedProduct);
    const body: { productId: string; warehouseId: string; quantity: number; expirationDate?: string; hasSafetyApproval?: boolean } = { productId: selectedProduct, warehouseId: selectedWarehouse, quantity };
    
    if (product?.category === 'PERISHABLE' && modalType === 'RECEIVE') {
      body.expirationDate = extraInfo;
    } else if (product?.category === 'HAZARDOUS' && modalType === 'ISSUE') {
      body.hasSafetyApproval = extraInfo === 'true';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      setActionError(data.error || 'エラーが発生しました');
      return;
    }

    setModalType(null);
    setExtraInfo('');
    setQuantity(1);
    loadData(); // Reactの強み：データ再取得でUIが即座に反映される
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'PERISHABLE': return <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded border border-green-300">生鮮食品</span>;
      case 'HAZARDOUS': return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded border border-red-300">危険物</span>;
      default: return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded border border-gray-300">通常品</span>;
    }
  };

  const selectedProductObj = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header bar */}
      <div className="bg-white border border-gray-300 rounded px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">在庫管理</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-0.5">現在の在庫状況と入出庫の管理を行います。</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setModalType('RECEIVE')} className="inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded text-sm font-semibold transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m7-7v14" /></svg>
            在庫受入
          </button>
          <button onClick={() => setModalType('ISSUE')} className="inline-flex items-center gap-1.5 bg-white border border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-semibold transition-colors focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M12 4v14" /></svg>
            在庫払出
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        {/* Table toolbar */}
        <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="製品名・倉庫名で検索" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm w-64 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white min-w-[140px]"
            >
              <option value="">カテゴリ: すべて</option>
              <option value="STANDARD">通常品</option>
              <option value="PERISHABLE">生鮮食品</option>
              <option value="HAZARDOUS">危険物</option>
            </select>

            <select 
              value={filterWarehouse} 
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white min-w-[140px]"
            >
              <option value="">保管倉庫: すべて</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-gray-500 ml-auto">全 {filteredInventory.length} 件</span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">データを読み込んでいます...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-300 text-xs">
                <tr>
                  <th className="px-5 py-3">製品名</th>
                  <th className="px-5 py-3">カテゴリ</th>
                  <th className="px-5 py-3">保管倉庫</th>
                  <th className="px-5 py-3 text-right">数量</th>
                  <th className="px-5 py-3 text-center">特記事項</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">該当する在庫はありません。</td></tr>
                ) : (
                  filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-primary-50/40 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{item.productName}</td>
                      <td className="px-5 py-3">{getCategoryBadge(item.category)}</td>
                      <td className="px-5 py-3 text-gray-600">{item.warehouseName}</td>
                      <td className="px-5 py-3 text-right font-mono text-gray-800 font-semibold">{item.quantity.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs text-center">
                        {item.expirationDate ? `期限: ${item.expirationDate}` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 rounded shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div className="px-5 py-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">
                {modalType === 'RECEIVE' ? '▼ 入庫（受入）処理' : '▲ 出庫（払出）処理'}
              </h3>
              <button onClick={() => {setModalType(null); setActionError('');}} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAction} className="p-5 space-y-4">
              {actionError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {actionError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">製品</label>
                <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">--- 選択してください ---</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({getCategoryName(p.category)})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">倉庫</label>
                <select required value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">--- 選択してください ---</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">数量</label>
                <input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>

              {selectedProductObj?.category === 'PERISHABLE' && modalType === 'RECEIVE' && (
                <div className="border border-green-300 rounded bg-green-50 p-3">
                  <label className="block text-xs font-semibold text-green-800 mb-1">【必須】消費期限（生鮮食品ルール）</label>
                  <input type="date" required value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} className="w-full rounded border border-green-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
                  <p className="text-xs text-green-700 mt-1">※過去の日付は許可されません（Domain Layerで検証）</p>
                </div>
              )}

              {selectedProductObj?.category === 'HAZARDOUS' && modalType === 'ISSUE' && (
                <div className="border border-red-300 rounded bg-red-50 p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" required checked={extraInfo === 'true'} onChange={(e) => setExtraInfo(e.target.checked ? 'true' : 'false')} className="form-checkbox text-red-600 rounded border-red-300 focus:ring-red-500 w-4 h-4" />
                    <span className="text-sm font-semibold text-red-800">安全管理者の出庫承認を確認済み</span>
                  </label>
                  <p className="text-xs text-red-600 mt-1 ml-6">※危険物の出庫には承認が必要です（Domain Layerで検証）</p>
                </div>
              )}

              <div className="pt-2 flex gap-2 border-t border-gray-200">
                <button type="button" onClick={() => {setModalType(null); setActionError('')}} className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-semibold">
                  キャンセル
                </button>
                <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-800 transition-colors text-sm font-semibold">
                  実行する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryName(category: string) {
  switch(category) {
    case 'PERISHABLE': return '生鮮食品';
    case 'HAZARDOUS': return '危険物';
    default: return '通常品';
  }
}
