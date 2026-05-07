import { NextResponse } from 'next/server';
import { getContentById, updateContent } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { txId } = await request.json();
    
    // In a real app, we would verify the txId on the Stacks blockchain
    // For now, we'll simulate verification and increment the unlock count
    const content = await getContentById(params.id);
    
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    const updatedContent = await updateContent(params.id, {
      totalUnlocks: (content.totalUnlocks || 0) + 1
    });
    
    return NextResponse.json({ 
      success: true, 
      content: updatedContent 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
