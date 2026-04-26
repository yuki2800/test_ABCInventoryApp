export default function HistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">入出庫履歴</h2>
        <p className="text-slate-500 mt-0.5">過去の入庫・出庫トランザクションを確認します。</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
        <div className="inline-flex p-4 bg-slate-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">Coming Soon</p>
        <p className="text-slate-400 text-sm mt-1">入出庫履歴機能は近日公開予定です。</p>
      </div>
    </div>
  );
}
