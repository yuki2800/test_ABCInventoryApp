import { IInventoryRepository } from '../domain/repositories/IInventoryRepository';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { IWarehouseRepository } from '../domain/repositories/IWarehouseRepository';
import { Inventory } from '../domain/entities/Inventory';

export class InventoryUseCases {
  constructor(
    private inventoryRepo: IInventoryRepository,
    private productRepo: IProductRepository,
    private warehouseRepo: IWarehouseRepository
  ) {}

  async getAllInventoryDetails() {
    const inventories = await this.inventoryRepo.findAll();
    const products = await this.productRepo.findAll();
    const warehouses = await this.warehouseRepo.findAll();

    return inventories.map(inv => {
      const product = products.find(p => p.id === inv.productId);
      const warehouse = warehouses.find(w => w.id === inv.warehouseId);
      return {
        ...inv,
        productName: product?.name || 'Unknown Product',
        category: product?.category || 'UNKNOWN',
        warehouseName: warehouse?.name || 'Unknown Warehouse',
      };
    });
  }

  async receiveInventory(
    productId: string, 
    warehouseId: string, 
    quantity: number, 
    additionalInfo?: Record<string, any>
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('製品が見つかりません。');
    
    const warehouse = await this.warehouseRepo.findById(warehouseId);
    if (!warehouse) throw new Error('倉庫が見つかりません。');

    // ドメインエンティティに定義された業務ルールの実行（DDDの強み）
    product.validateReceipt(quantity, additionalInfo);

    let inventory = await this.inventoryRepo.findByProductAndWarehouse(productId, warehouseId);
    if (!inventory) {
      const id = `inv_${Date.now()}`;
      inventory = new Inventory(id, productId, warehouseId, quantity, additionalInfo?.expirationDate);
    } else {
      inventory.addQuantity(quantity);
      if (additionalInfo?.expirationDate) {
        inventory.expirationDate = additionalInfo.expirationDate; // 簡易的に更新
      }
    }

    await this.inventoryRepo.save(inventory);
    return inventory;
  }

  async issueInventory(
    productId: string, 
    warehouseId: string, 
    quantity: number, 
    additionalInfo?: Record<string, any>
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('製品が見つかりません。');

    const inventory = await this.inventoryRepo.findByProductAndWarehouse(productId, warehouseId);
    if (!inventory) throw new Error('指定された倉庫に該当製品の在庫がありません。');

    // ドメインエンティティに定義された業務ルールの実行（DDDの強み）
    product.validateIssue(quantity, inventory.quantity, additionalInfo);

    inventory.removeQuantity(quantity);
    await this.inventoryRepo.save(inventory);
    return inventory;
  }
}
