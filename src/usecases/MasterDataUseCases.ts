import { IProductRepository } from '../domain/repositories/IProductRepository';
import { IWarehouseRepository } from '../domain/repositories/IWarehouseRepository';

export class MasterDataUseCases {
  constructor(
    private productRepo: IProductRepository,
    private warehouseRepo: IWarehouseRepository
  ) {}

  async getAllProducts() {
    return await this.productRepo.findAll();
  }

  async getAllWarehouses() {
    return await this.warehouseRepo.findAll();
  }
}
