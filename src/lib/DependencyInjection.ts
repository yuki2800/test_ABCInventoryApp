import { WarehouseRepository } from '../adapters/repositories/WarehouseRepository';
import { ProductRepository } from '../adapters/repositories/ProductRepository';
import { InventoryRepository } from '../adapters/repositories/InventoryRepository';

import { InventoryUseCases } from '../usecases/InventoryUseCases';
import { MasterDataUseCases } from '../usecases/MasterDataUseCases';

import { InventoryController } from '../adapters/controllers/InventoryController';
import { MasterDataController } from '../adapters/controllers/MasterDataController';

const warehouseRepo = new WarehouseRepository();
const productRepo = new ProductRepository();
const inventoryRepo = new InventoryRepository();

const inventoryUseCases = new InventoryUseCases(inventoryRepo, productRepo, warehouseRepo);
const masterDataUseCases = new MasterDataUseCases(productRepo, warehouseRepo);

export const inventoryController = new InventoryController(inventoryUseCases);
export const masterDataController = new MasterDataController(masterDataUseCases);
