import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/reports.json'); // Reusing report logic for purchase records if not present
const CONTENT_FILE = path.join(process.cwd(), 'data/content.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    // This is a mockup of fetching purchase records. 
    // In a real app, you'd query a database for records where buyerAddress === address
    // For now, let's return some mock records if no data file exists
    let purchases = [
      {
        id: '1',
        contentId: 'content-1',
        title: 'Cyberpunk Digital Art',
        amount: '5.0 STX',
        txId: '0x123...456',
        timestamp: Date.now() - 86400000,
        status: 'success'
      },
      {
        id: '2',
        contentId: 'content-2',
        title: 'Stacks Nakamoto Upgrade',
        amount: '2.0 STX',
        txId: '0xabc...def',
        timestamp: Date.now() - 172800000,
        status: 'success'
      }
    ];

    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}
