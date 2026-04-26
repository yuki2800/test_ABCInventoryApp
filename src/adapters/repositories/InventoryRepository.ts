import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory } from '../../domain/entities/Inventory';
import { InMemoryStore } from './InMemoryDataStore';

export class InventoryRepository implements IInventoryRepository {
  async findAll(): Promise<Inventory[]> {
    return InMemoryStore.inventories;
  }

  async findByProductId(productId: string): Promise<Inventory[]> {
    return InMemoryStore.inventories.filter(i => i.productId === productId);
  }

  async findByWarehouseId(warehouseId: string): Promise<Inventory[]> {
    return InMemoryStore.inventories.filter(i => i.warehouseId === warehouseId);
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string): Promise<Inventory | null> {
    const inventory = InMemoryStore.inventories.find(
      i => i.productId === productId && i.warehouseId === warehouseId
    );
    return inventory || null;
  }

  async save(inventory: Inventory): Promise<void> {
    const index = InMemoryStore.inventories.findIndex(i => i.id === inventory.id);
    if (index >= 0) {
      InMemoryStore.inventories[index] = inventory;
    } else {
      InMemoryStore.inventories.push(inventory);
    }
  }
}
