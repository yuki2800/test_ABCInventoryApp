import { MasterDataUseCases } from '../../usecases/MasterDataUseCases';

export class MasterDataController {
  constructor(private masterDataUseCases: MasterDataUseCases) {}

  async getAllProducts() {
    try {
      const data = await this.masterDataUseCases.getAllProducts();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getAllWarehouses() {
    try {
      const data = await this.masterDataUseCases.getAllWarehouses();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
