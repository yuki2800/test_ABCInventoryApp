# ダッシュボード検索条件の拡張計画

ダッシュボードの在庫一覧において、従来のテキスト検索に加え、「カテゴリ」と「保管倉庫」による絞り込み機能を追加します。

## ユーザーレビューが必要な事項
特にありません。標準的なUI拡張です。

## 変更内容

### [Dashboard (UI/Logic)](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/page.tsx)

#### [MODIFY] [page.tsx](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/src/app/page.tsx)

1.  **状態管理の追加**
    *   `filterCategory`: 選択されたカテゴリを管理する状態（初期値: `''` = すべて）。
    *   `filterWarehouse`: 選択された倉庫IDを管理する状態（初期値: `''` = すべて）。

2.  **UIの更新**
    *   既存の検索窓（input）の右側に、カテゴリ選択用と倉庫選択用の `<select>` 要素を追加します。
    *   カテゴリのオプション: 「すべて」「通常品」「生鮮食品」「危険物」。
    *   倉庫のオプション: 「すべて」に加え、`warehouses` ステートから動的に生成。

3.  **フィルタリングロジックの修正**
    *   `filteredInventory` を算出する `useMemo` の依存配列に `filterCategory` 和 `filterWarehouse` を追加。
    *   `.filter()` のロジックを拡充：
        ```typescript
        const matchesText = inv.productName.toLowerCase().includes(search.toLowerCase()) ||
                            inv.warehouseName.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !filterCategory || inv.category === filterCategory;
        const matchesWarehouse = !filterWarehouse || inv.warehouseId === filterWarehouse;
        return matchesText && matchesCategory && matchesWarehouse;
        ```

---

## 検証計画

### 手動確認
1.  **テキスト検索**: 従来通り、製品名や倉庫名で絞り込めることを確認。
2.  **カテゴリ検索**: 各カテゴリを選択した際、正しく絞り込まれることを確認。
3.  **倉庫検索**: 特定の倉庫を選択した際、その倉庫の在庫のみが表示されることを確認。
4.  **複合検索**: すべての条件を組み合わせて検索結果が正しくなることを確認。
5.  **リセット**: 条件を「すべて」に戻した際に全件表示されることを確認。
