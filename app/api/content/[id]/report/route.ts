import { NextResponse } from 'next/server';
import { addReport } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { reason, reporterAddress } = await request.json();

    if (!reason || !reporterAddress) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addReport({
      contentId: params.id,
      reason,
      reporterAddress
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
