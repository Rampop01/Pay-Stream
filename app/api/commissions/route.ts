import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/commissions.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    const role = searchParams.get('role'); // 'creator' or 'client'

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    let commissions = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (role === 'creator') {
        commissions = data.filter((c: any) => c.creatorAddress === address);
      } else {
        commissions = data.filter((c: any) => c.clientAddress === address);
      }
    }

    return NextResponse.json(commissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const commission = await req.json();
    
    const newCommission = {
      id: `comm-${Date.now()}`,
      ...commission,
      status: 'pending',
      timestamp: Date.now()
    };

    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    data.push(newCommission);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json(newCommission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create commission' }, { status: 500 });
  }
}
