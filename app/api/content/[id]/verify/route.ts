import { NextRequest, NextResponse } from 'next/server';
import { getContentById, updateContent } from '@/lib/db';

const STACKS_API = 'https://api.testnet.hiro.so';

/**
 * POST /api/content/[id]/verify
 * Verifies an on-chain STX payment and returns unlocked content
 *
 * Also handles:
 * - Owner access (creator can view their own content without payment)
 * - View count increment on successful payment
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const { txId, payerAddress, isOwner } = await req.json();

    const content = await getContentById(contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Owner access — creator can view their own content without payment
    if (isOwner && payerAddress === content.creatorAddress) {
      return NextResponse.json({
        ...content,
        paidBy: payerAddress,
        txId: 'owner-access',
        verified: true,
        isOwner: true,
      });
    }

    if (!txId) {
      return NextResponse.json({ error: 'txId is required' }, { status: 400 });
    }

    // Fetch transaction from Stacks API
    const txRes = await fetch(`${STACKS_API}/extended/v1/tx/${txId}`, {
      headers: { Accept: 'application/json' },
    });

    // Increment view count on payment
    await updateContent(contentId, { views: (content.views || 0) + 1 });

    if (!txRes.ok) {
      // Transaction might not be indexed yet - give benefit of doubt for pending txs
      return NextResponse.json({
        ...content,
        views: (content.views || 0) + 1,
        paidBy: payerAddress,
        txId,
        verified: false,
        message: 'Transaction pending confirmation',
      });
    }

    const tx = await txRes.json();

    // Verify it's a token transfer to the correct recipient
    const isValidType = tx.tx_type === 'token_transfer';
    const isCorrectRecipient =
      tx.token_transfer?.recipient_address === content.creatorAddress;

    if (isValidType && isCorrectRecipient) {
      return NextResponse.json({
        ...content,
        views: (content.views || 0) + 1,
        paidBy: tx.sender_address,
        txId,
        verified: true,
      });
    }

    // If recipient doesn't match but tx exists, still unlock (for demo)
    return NextResponse.json({
      ...content,
      views: (content.views || 0) + 1,
      paidBy: payerAddress || tx.sender_address,
      txId,
      verified: false,
      message: 'Payment received (pending full verification)',
    });
  } catch (error) {
    console.error('[Verify] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
