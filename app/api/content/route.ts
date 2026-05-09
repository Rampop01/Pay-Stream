import { NextResponse } from 'next/server';
import { getAllContent, addContent, getContentByCreator } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorAddress = searchParams.get('creatorAddress');

    let contents;
    if (creatorAddress) {
      contents = await getContentByCreator(creatorAddress);
    } else {
      contents = await getAllContent();
    }
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContent = await addContent(body);
    return NextResponse.json(newContent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}
