# テーマカラーの明色化と変数化計画

ユーザーの「もう少し明るい青緑」という要望に応え、現在の Teal（落ち着いた青緑）から Cyan（鮮やかな青緑/シアン）へ変更します。また、今後の微調整を容易にするため、Tailwind CSS のカスタムテーマ変数 `primary` を導入します。

## 変更内容

### 1. グローバルテーマの定義
#### [MODIFY] [globals.css](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/globals.css)
*   `@theme inline` ブロック内に `primary` カラーを定義します。
*   ベースカラーとして `cyan` を採用します。これにより、以前の `teal` よりも明るく鮮やかな印象になります。

### 2. 全コンポーネントのカラー変数化
以下のファイルの `teal-`（および一部残っている可能性のある `blue-`）クラスを `primary-` に置換します。

#### [MODIFY] [SidebarNav.tsx](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/components/SidebarNav.tsx)
*   `teal-950` -> `primary-950` 等、全て `primary-` に統一。

#### [MODIFY] [Header.tsx](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/components/Header.tsx)
*   `teal-700` -> `primary-700` 等。

#### [MODIFY] [page.tsx (Dashboard)](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/page.tsx)
*   ボタン、フォーカス、ホバー色を `primary-` に統一。

#### [MODIFY] [Master Pages](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/master/page.tsx)
*   マスタ管理の各ページも `primary-` に統一。

## 利点
*   **一貫性**: `primary` 変数を使用することで、アプリ全体の配色が完全に同期します。
*   **柔軟性**: 万が一「やっぱりもう少しグリーン寄りに」となった場合、`globals.css` の定義を `primary: emerald` 等に変えるだけで全ページが即座に反映されます。

## 確認計画
### 手動確認
1.  **色彩の明るさ**: 全体的に明るく鮮やかな青緑色（シアン）になっているか。
2.  **一貫性**: サイドバー、ヘッダー、ボタン、リンクの全ての色が同期しているか。
3.  **視認性**: 明るくなったことで、白背景や濃い背景の上での文字の読みやすさに問題がないか。
