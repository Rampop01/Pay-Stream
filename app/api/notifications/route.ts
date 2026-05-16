import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/notifications.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    let notifications = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      notifications = data.filter((n: any) => n.recipient === address);
    }

    // Sort by timestamp desc
    notifications.sort((a: any, b: any) => b.timestamp - a.timestamp);

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { address, notificationIds } = await req.json();

    if (!address || !notificationIds) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      const updated = data.map((n: any) => {
        if (n.recipient === address && notificationIds.includes(n.id)) {
          return { ...n, read: true };
        }
        return n;
      });
      fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
