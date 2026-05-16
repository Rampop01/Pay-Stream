import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data/content.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    let stats = {
      totalEarned: 0,
      itemsSold: 0,
      reputation: 100
    };

    if (fs.existsSync(CONTENT_FILE)) {
      const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
      const creatorContent = content.filter((c: any) => c.creatorAddress === address);
      
      stats.itemsSold = creatorContent.reduce((acc: number, curr: any) => acc + (curr.totalUnlocks || 0), 0);
      stats.totalEarned = creatorContent.reduce((acc: number, curr: any) => acc + ((curr.totalUnlocks || 0) * curr.priceInSTX), 0);
    }

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
