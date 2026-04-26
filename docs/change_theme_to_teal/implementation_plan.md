# テーマカラー変更計画（青緑色への刷新）

システムの基調となるカラーを現在の「ブルー」から「青緑色（Teal）」に変更し、清潔感とプロフェッショナルな印象を強化します。

## 変更内容

### 1. グローバルスタイルの更新
#### [MODIFY] [globals.css](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/globals.css)
*   `.nav-active-glow` のシャドウの色を `rgba(99, 102, 241, ...)` (Indigo系) から `rgba(20, 184, 166, ...)` (Teal系) に変更します。

### 2. コンポーネントの配色変更
以下のファイルの `blue-` クラスを `teal-` に置換、または適切な青緑系の配色に調整します。

#### [MODIFY] [SidebarNav.tsx](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/components/SidebarNav.tsx)
*   背景色: `bg-blue-950` -> `bg-teal-950`
*   アクティブ要素: `bg-blue-900`, `border-blue-400` -> `bg-teal-900`, `border-teal-400`
*   テキスト・アイコン: `text-blue-300` -> `text-teal-300`

#### [MODIFY] [Header.tsx](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/components/Header.tsx)
*   アクセントバー: `bg-blue-700` -> `bg-teal-700`
*   ユーザーバッジ: `bg-blue-700` -> `bg-teal-700`

### 3. 各ページの配色変更
#### [MODIFY] [page.tsx (Dashboard)](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/page.tsx)
*   プライマリボタン: `bg-blue-700` -> `bg-teal-700`
*   テーブルホバー: `hover:bg-blue-50/40` -> `hover:bg-teal-50/40`
*   検索窓フォーカス: `focus:ring-blue-500` -> `focus:ring-teal-500`

#### [MODIFY] [Products Master](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/master/products/page.tsx)
*   新規登録ボタン、編集ボタンの配色を `teal` 系に変更します。

#### [MODIFY] [Warehouse Master](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/master/warehouses/page.tsx)
*   既に `emerald` や `teal` が使われていますが、全体のトーンに合わせて `teal` に統一します。

## 確認計画
### 手動確認
1.  **サイドバー**: 背景色、アクティブ状態、ホバー効果が青緑色で統一されているか。
2.  **ヘッダー**: アクセント色が変わっているか。
3.  **ボタン・入力フィードバック**: 全てのボタン（入庫・出庫・新規登録・編集）および検索窓のフォーカスリングが青緑色になっているか。
4.  **テーブル**: ホバー時のハイライト色が自然な青緑色（薄い色）になっているか。
