import { NextResponse } from 'next/server';
import { getServerConfigStatus } from '@/lib/config';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getServerConfigStatus());
}
