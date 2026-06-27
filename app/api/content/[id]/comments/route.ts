import { NextResponse } from 'next/server';
import { addComment } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userAddress, text } = await request.json();

    if (!userAddress || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const comment = await addComment(id, {
      contentId: id,
      userAddress,
      text
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
