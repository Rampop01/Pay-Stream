import { NextResponse } from 'next/server';
import { addStake, getStakes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    const stakes = await getStakes();
    
    if (address) {
      // Return stakes specifically for this user
      const userStakes = stakes.filter(s => s.stakerAddress === address);
      return NextResponse.json(userStakes);
    }
    
    return NextResponse.json(stakes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stakes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creatorAddress, stakerAddress, amountSTX } = body;
    
    if (!creatorAddress || !stakerAddress || !amountSTX) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const stake = await addStake({
      creatorAddress,
      stakerAddress,
      amountSTX: Number(amountSTX)
    });
    
    return NextResponse.json(stake);
  } catch (error) {
    console.error('[Stakes API] Failed to add stake:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
