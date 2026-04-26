import { Inventory } from '../entities/Inventory';

export interface IInventoryRepository {
  findAll(): Promise<Inventory[]>;
  findByProductId(productId: string): Promise<Inventory[]>;
  findByWarehouseId(warehouseId: string): Promise<Inventory[]>;
  findByProductAndWarehouse(productId: string, warehouseId: string): Promise<Inventory | null>;
  save(inventory: Inventory): Promise<void>;
}
