import { InventoryUseCases } from '../../usecases/InventoryUseCases';

export class InventoryController {
  constructor(private inventoryUseCases: InventoryUseCases) {}

  async getAllInventoryDetails() {
    try {
      const details = await this.inventoryUseCases.getAllInventoryDetails();
      return { success: true, data: details };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message };
    }
  }

  async receiveInventory(body: { productId: string; warehouseId: string; quantity: number; expirationDate?: string }) {
    try {
      const { productId, warehouseId, quantity, expirationDate } = body;
      const additionalInfo = expirationDate ? { expirationDate } : undefined;
      const result = await this.inventoryUseCases.receiveInventory(productId, warehouseId, quantity, additionalInfo);
      return { success: true, data: result };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message };
    }
  }

  async issueInventory(body: { productId: string; warehouseId: string; quantity: number; hasSafetyApproval?: boolean }) {
    try {
      const { productId, warehouseId, quantity, hasSafetyApproval } = body;
      const additionalInfo = hasSafetyApproval !== undefined ? { hasSafetyApproval } : undefined;
      const result = await this.inventoryUseCases.issueInventory(productId, warehouseId, quantity, additionalInfo);
      return { success: true, data: result };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message };
    }
  }
}
