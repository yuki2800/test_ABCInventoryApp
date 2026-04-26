export default function SettingsPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header bar */}
      <div className="bg-white border border-gray-300 rounded px-5 py-4">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">システム</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">設定</h1>
        <p className="text-sm text-gray-500 mt-0.5">システムの各種設定を管理します。</p>
      </div>

      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-300 bg-gray-50">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">システム設定</span>
        </div>
        <div className="p-12 text-center">
          <div className="inline-flex p-4 bg-gray-100 border border-gray-300 rounded mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-semibold text-sm">Coming Soon</p>
          <p className="text-gray-400 text-xs mt-1">設定機能は近日公開予定です。</p>
        </div>
      </div>
    </div>
  );
}
