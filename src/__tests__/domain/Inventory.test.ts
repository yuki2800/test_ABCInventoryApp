import { describe, it, expect } from 'vitest';
import { Inventory } from '../../domain/entities/Inventory';

describe('Inventory', () => {
  describe('addQuantity（入庫）', () => {
    it('数量を正しく加算できる', () => {
      const inv = new Inventory('inv1', 'p1', 'w1', 10);
      inv.addQuantity(5);
      expect(inv.quantity).toBe(15);
    });

    it('初期在庫が 0 でも加算できる', () => {
      const inv = new Inventory('inv2', 'p1', 'w1', 0);
      inv.addQuantity(20);
      expect(inv.quantity).toBe(20);
    });

    it('複数回加算が正しく積算される', () => {
      const inv = new Inventory('inv3', 'p1', 'w1', 0);
      inv.addQuantity(10);
      inv.addQuantity(10);
      inv.addQuantity(10);
      expect(inv.quantity).toBe(30);
    });
  });

  describe('removeQuantity（出庫）', () => {
    it('在庫以下の数量を正しく減算できる', () => {
      const inv = new Inventory('inv4', 'p1', 'w1', 20);
      inv.removeQuantity(8);
      expect(inv.quantity).toBe(12);
    });

    it('在庫と同数を出庫できる（在庫が 0 になる）', () => {
      const inv = new Inventory('inv5', 'p1', 'w1', 10);
      inv.removeQuantity(10);
      expect(inv.quantity).toBe(0);
    });

    it('在庫を超えた数量を出庫した場合はエラー', () => {
      const inv = new Inventory('inv6', 'p1', 'w1', 5);
      expect(() => inv.removeQuantity(10)).toThrow('在庫数量が足りません。');
    });

    it('加算後に減算が正しく動作する', () => {
      const inv = new Inventory('inv7', 'p1', 'w1', 5);
      inv.addQuantity(10);
      inv.removeQuantity(8);
      expect(inv.quantity).toBe(7);
    });
  });

  describe('コンストラクタ', () => {
    it('初期プロパティが正しく設定される', () => {
      const inv = new Inventory('inv8', 'prod-001', 'ware-001', 100, '2027-12-31');
      expect(inv.id).toBe('inv8');
      expect(inv.productId).toBe('prod-001');
      expect(inv.warehouseId).toBe('ware-001');
      expect(inv.quantity).toBe(100);
      expect(inv.expirationDate).toBe('2027-12-31');
    });

    it('消費期限なしで生成できる', () => {
      const inv = new Inventory('inv9', 'prod-002', 'ware-002', 50);
      expect(inv.expirationDate).toBeUndefined();
    });
  });
});
