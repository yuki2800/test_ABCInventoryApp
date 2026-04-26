import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { InMemoryStore } from './InMemoryDataStore';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return InMemoryStore.products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = InMemoryStore.products.find(p => p.id === id);
    return product || null;
  }

  async save(product: Product): Promise<void> {
    const index = InMemoryStore.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      InMemoryStore.products[index] = product;
    } else {
      InMemoryStore.products.push(product);
    }
  }
}
