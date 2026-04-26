import { Warehouse } from '../../domain/entities/Warehouse';
import { Product, ProductFactory, ProductCategory } from '../../domain/entities/Product';
import { Inventory } from '../../domain/entities/Inventory';

type Store = {
  warehouses: Warehouse[];
  products: Product[];
  inventories: Inventory[];
};

const defaultData: Store = {
  warehouses: [
    new Warehouse('w1', '東京メイン倉庫', 1000),
    new Warehouse('w2', '大阪サブ倉庫', 500)
  ],
  products: [
    ProductFactory.create('p1', '標準キーボード', ProductCategory.STANDARD, 3000),
    ProductFactory.create('p2', '高級有機野菜', ProductCategory.PERISHABLE, 800),
    ProductFactory.create('p3', '工業用アセトン', ProductCategory.HAZARDOUS, 12000)
  ],
  inventories: [
    new Inventory('i1', 'p1', 'w1', 150),
    new Inventory('i2', 'p2', 'w1', 50, '2027-12-31'),
    new Inventory('i3', 'p3', 'w2', 10)
  ]
};

declare global {
  var __inMemoryStore: Store | undefined;
}

if (!global.__inMemoryStore) {
  global.__inMemoryStore = defaultData;
}

export const InMemoryStore = global.__inMemoryStore;
