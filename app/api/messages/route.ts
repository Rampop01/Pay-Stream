import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/messages.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    let messages = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      messages = data.filter((m: any) => m.sender === address || m.recipient === address);
    } else {
      // Mock data for initial testing
      messages = [
        {
          id: 'm1',
          sender: 'SP1BTBG1TW13NEV2FQM7HC1BZ9XZV7FZSGPMVV38M',
          recipient: address,
          content: 'Hey! Thanks for unlocking my course. Let me know if you have any questions!',
          timestamp: Date.now() - 3600000,
          read: false
        }
      ];
    }

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sender, recipient, content } = await req.json();

    if (!sender || !recipient || !content) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender,
      recipient,
      content,
      timestamp: Date.now(),
      read: false
    };

    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    data.push(newMessage);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
