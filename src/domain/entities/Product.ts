export enum ProductCategory {
  STANDARD = 'STANDARD',
  PERISHABLE = 'PERISHABLE',
  HAZARDOUS = 'HAZARDOUS',
}

export abstract class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public category: ProductCategory,
    public price: number
  ) {}

  // ドメイン駆動設計（DDD）の強み：
  // 業務ルール（ビジネスロジック）をエンティティ自身が持つことで凝集性を高める
  // 製品カテゴリごとに受入（入庫）時の検証ルールが異なる
  abstract validateReceipt(quantity: number, additionalInfo?: Record<string, any>): void;

  // 払出（出庫）時の検証ルール
  abstract validateIssue(quantity: number, currentStock: number, additionalInfo?: Record<string, any>): void;
}

export class StandardProduct extends Product {
  constructor(id: string, name: string, price: number) {
    super(id, name, ProductCategory.STANDARD, price);
  }

  validateReceipt(quantity: number): void {
    if (quantity <= 0) throw new Error('入庫数量は1以上である必要があります。');
  }

  validateIssue(quantity: number, currentStock: number): void {
    if (quantity <= 0) throw new Error('出庫数量は1以上である必要があります。');
    if (currentStock < quantity) throw new Error('在庫が不足しています。');
  }
}

export class PerishableProduct extends Product {
  constructor(id: string, name: string, price: number) {
    super(id, name, ProductCategory.PERISHABLE, price);
  }

  validateReceipt(quantity: number, additionalInfo?: { expirationDate: string }): void {
    if (quantity <= 0) throw new Error('入庫数量は1以上である必要があります。');
    if (!additionalInfo || !additionalInfo.expirationDate) {
      throw new Error('生鮮食品の入庫には消費期限が必要です。');
    }

    const expDate = new Date(additionalInfo.expirationDate);
    const today = new Date();
    if (expDate <= today) {
      throw new Error('消費期限が過ぎているか、本日の日付です。入庫できません。');
    }
  }

  validateIssue(quantity: number, currentStock: number): void {
    if (quantity <= 0) throw new Error('出庫数量は1以上である必要があります。');
    if (currentStock < quantity) throw new Error('在庫が不足しています。');
    // Note: 実際の業務では一番期限の近いものから払出すロジック等が必要ですが、簡略化
  }
}

export class HazardousProduct extends Product {
  constructor(id: string, name: string, price: number) {
    super(id, name, ProductCategory.HAZARDOUS, price);
  }

  validateReceipt(quantity: number): void {
    if (quantity <= 0) throw new Error('入庫数量は1以上である必要があります。');
  }

  validateIssue(quantity: number, currentStock: number, additionalInfo?: { hasSafetyApproval: boolean }): void {
    if (quantity <= 0) throw new Error('出庫数量は1以上である必要があります。');
    if (currentStock < quantity) throw new Error('在庫が不足しています。');
    
    if (!additionalInfo || !additionalInfo.hasSafetyApproval) {
      throw new Error('危険物の出庫には安全管理者の承認（フラグ）が必要です。');
    }
  }
}

// ファクトリメソッド
export class ProductFactory {
  static create(id: string, name: string, category: ProductCategory, price: number): Product {
    switch (category) {
      case ProductCategory.STANDARD: return new StandardProduct(id, name, price);
      case ProductCategory.PERISHABLE: return new PerishableProduct(id, name, price);
      case ProductCategory.HAZARDOUS: return new HazardousProduct(id, name, price);
      default: throw new Error('不明な製品カテゴリです');
    }
  }
}
