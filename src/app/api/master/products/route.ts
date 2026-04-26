import { NextResponse } from 'next/server';
import { masterDataController } from '../../../../lib/DependencyInjection';

export async function GET() {
  const result = await masterDataController.getAllProducts();
  if (result.success) {
    return NextResponse.json(result.data);
  }
  return NextResponse.json({ error: result.error }, { status: 500 });
}
