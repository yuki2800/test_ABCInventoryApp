import { describe, it, expect } from 'vitest';
import {
  StandardProduct,
  PerishableProduct,
  HazardousProduct,
  ProductFactory,
  ProductCategory,
} from '../../domain/entities/Product';

// ===== StandardProduct =====
describe('StandardProduct', () => {
  const product = new StandardProduct('p1', 'テスト商品A', 1000);

  describe('validateReceipt（入庫バリデーション）', () => {
    it('正の数量であれば入庫できる', () => {
      expect(() => product.validateReceipt(10)).not.toThrow();
    });

    it('数量が0の場合はエラー', () => {
      expect(() => product.validateReceipt(0)).toThrow('入庫数量は1以上である必要があります。');
    });

    it('数量が負の場合はエラー', () => {
      expect(() => product.validateReceipt(-5)).toThrow('入庫数量は1以上である必要があります。');
    });
  });

  describe('validateIssue（出庫バリデーション）', () => {
    it('在庫以下の数量であれば出庫できる', () => {
      expect(() => product.validateIssue(5, 10)).not.toThrow();
    });

    it('在庫と同数は出庫できる', () => {
      expect(() => product.validateIssue(10, 10)).not.toThrow();
    });

    it('在庫を超えた数量はエラー', () => {
      expect(() => product.validateIssue(11, 10)).toThrow('在庫が不足しています。');
    });

    it('出庫数量が0の場合はエラー', () => {
      expect(() => product.validateIssue(0, 10)).toThrow('出庫数量は1以上である必要があります。');
    });

    it('出庫数量が負の場合はエラー', () => {
      expect(() => product.validateIssue(-1, 10)).toThrow('出庫数量は1以上である必要があります。');
    });
  });
});

// ===== PerishableProduct =====
describe('PerishableProduct', () => {
  const product = new PerishableProduct('p2', '牛乳', 200);

  describe('validateReceipt（入庫バリデーション）', () => {
    it('消費期限が未来の日付であれば入庫できる', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      expect(() =>
        product.validateReceipt(5, { expirationDate: futureDate.toISOString().split('T')[0] })
      ).not.toThrow();
    });

    it('消費期限がない場合はエラー', () => {
      expect(() => product.validateReceipt(5)).toThrow('生鮮食品の入庫には消費期限が必要です。');
    });

    it('消費期限が過去の場合はエラー', () => {
      expect(() =>
        product.validateReceipt(5, { expirationDate: '2000-01-01' })
      ).toThrow('消費期限が過ぎているか、本日の日付です。入庫できません。');
    });

    it('数量が0の場合はエラー', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(() =>
        product.validateReceipt(0, { expirationDate: futureDate.toISOString().split('T')[0] })
      ).toThrow('入庫数量は1以上である必要があります。');
    });
  });

  describe('validateIssue（出庫バリデーション）', () => {
    it('在庫以下の数量であれば出庫できる', () => {
      expect(() => product.validateIssue(3, 10)).not.toThrow();
    });

    it('在庫を超えた場合はエラー', () => {
      expect(() => product.validateIssue(15, 10)).toThrow('在庫が不足しています。');
    });
  });
});

// ===== HazardousProduct =====
describe('HazardousProduct', () => {
  const product = new HazardousProduct('p3', '危険物X', 5000);

  describe('validateReceipt（入庫バリデーション）', () => {
    it('正の数量であれば入庫できる', () => {
      expect(() => product.validateReceipt(1)).not.toThrow();
    });

    it('数量が0の場合はエラー', () => {
      expect(() => product.validateReceipt(0)).toThrow('入庫数量は1以上である必要があります。');
    });
  });

  describe('validateIssue（出庫バリデーション）', () => {
    it('安全管理者承認がある場合は出庫できる', () => {
      expect(() =>
        product.validateIssue(2, 10, { hasSafetyApproval: true })
      ).not.toThrow();
    });

    it('安全管理者承認がない場合はエラー', () => {
      expect(() =>
        product.validateIssue(2, 10, { hasSafetyApproval: false })
      ).toThrow('危険物の出庫には安全管理者の承認（フラグ）が必要です。');
    });

    it('additionalInfo が undefined の場合はエラー', () => {
      expect(() => product.validateIssue(2, 10)).toThrow(
        '危険物の出庫には安全管理者の承認（フラグ）が必要です。'
      );
    });

    it('在庫を超えた場合はエラー', () => {
      expect(() =>
        product.validateIssue(20, 10, { hasSafetyApproval: true })
      ).toThrow('在庫が不足しています。');
    });
  });
});

// ===== ProductFactory =====
describe('ProductFactory', () => {
  it('STANDARD カテゴリで StandardProduct を生成する', () => {
    const p = ProductFactory.create('f1', '標準品', ProductCategory.STANDARD, 100);
    expect(p).toBeInstanceOf(StandardProduct);
    expect(p.category).toBe(ProductCategory.STANDARD);
  });

  it('PERISHABLE カテゴリで PerishableProduct を生成する', () => {
    const p = ProductFactory.create('f2', '生鮮品', ProductCategory.PERISHABLE, 200);
    expect(p).toBeInstanceOf(PerishableProduct);
    expect(p.category).toBe(ProductCategory.PERISHABLE);
  });

  it('HAZARDOUS カテゴリで HazardousProduct を生成する', () => {
    const p = ProductFactory.create('f3', '危険物', ProductCategory.HAZARDOUS, 999);
    expect(p).toBeInstanceOf(HazardousProduct);
    expect(p.category).toBe(ProductCategory.HAZARDOUS);
  });
});
