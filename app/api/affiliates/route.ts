import { NextResponse } from 'next/server';
import { getReferralEarnings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    
    const allEarnings = await getReferralEarnings();
    const userEarnings = allEarnings.filter(e => e.referrerAddress === address);
    
    return NextResponse.json(userEarnings);
  } catch (error) {
    console.error('[Affiliates API] Error fetching referral earnings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
