export class Inventory {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public quantity: number,
    public expirationDate?: string // 生鮮食品用
  ) {}

  addQuantity(amount: number) {
    this.quantity += amount;
  }

  removeQuantity(amount: number) {
    if (this.quantity < amount) {
      throw new Error('在庫数量が足りません。');
    }
    this.quantity -= amount;
  }
}
