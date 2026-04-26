import { Warehouse } from '../entities/Warehouse';

export interface IWarehouseRepository {
  findAll(): Promise<Warehouse[]>;
  findById(id: string): Promise<Warehouse | null>;
  save(warehouse: Warehouse): Promise<void>;
}
