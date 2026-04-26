import { IWarehouseRepository } from '../../domain/repositories/IWarehouseRepository';
import { Warehouse } from '../../domain/entities/Warehouse';
import { InMemoryStore } from './InMemoryDataStore';

export class WarehouseRepository implements IWarehouseRepository {
  async findAll(): Promise<Warehouse[]> {
    return InMemoryStore.warehouses;
  }

  async findById(id: string): Promise<Warehouse | null> {
    const warehouse = InMemoryStore.warehouses.find(w => w.id === id);
    return warehouse || null;
  }

  async save(warehouse: Warehouse): Promise<void> {
    const index = InMemoryStore.warehouses.findIndex(w => w.id === warehouse.id);
    if (index >= 0) {
      InMemoryStore.warehouses[index] = warehouse;
    } else {
      InMemoryStore.warehouses.push(warehouse);
    }
  }
}
