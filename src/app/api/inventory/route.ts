import { NextResponse } from 'next/server';
import { inventoryController } from '../../../lib/DependencyInjection';

export async function GET() {
  const result = await inventoryController.getAllInventoryDetails();
  if (result.success) {
    return NextResponse.json(result.data);
  }
  return NextResponse.json({ error: result.error }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await inventoryController.receiveInventory(body);
    if (result.success) {
      return NextResponse.json(result.data);
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
