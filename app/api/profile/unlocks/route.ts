import { NextResponse } from 'next/server';
import { getUnlocksByBuyer, getContentById } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const unlockRecords = await getUnlocksByBuyer(address);
    
    // Fetch full content details for each unlock
    const library = await Promise.all(
      unlockRecords.map(async (record) => {
        const content = await getContentById(record.contentId);
        return {
          ...content,
          purchasedAt: record.timestamp,
          txId: record.txId
        };
      })
    );

    // Filter out any nulls (if content was deleted but unlock record remains)
    return NextResponse.json(library.filter(item => item.id));
  } catch (error) {
    console.error('Library fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}
