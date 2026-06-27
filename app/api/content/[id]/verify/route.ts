import { NextRequest, NextResponse } from 'next/server';
import { getContentById, updateContent, recordUnlock, addReferralEarning } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { txId, buyerAddress, referrerAddress } = await req.json();

    if (!txId || !buyerAddress) {
      return NextResponse.json({ error: 'Missing txId or buyerAddress' }, { status: 400 });
    }

    console.log(`[VERIFY] Verifying transaction ${txId} for content ${id} and buyer ${buyerAddress}`);

    const content = await getContentById(id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Call Hiro API to verify transaction (mocked logic or real logic)
    const hiroRes = await fetch(`https://api.mainnet.hiro.so/extended/v1/tx/${txId}`);
    if (!hiroRes.ok) {
      return NextResponse.json({ error: 'Transaction not found on-chain' }, { status: 404 });
    }

    const txData = await hiroRes.json();
    
    if (txData.tx_status !== 'success' && txData.tx_status !== 'pending') {
      return NextResponse.json({ error: 'Transaction failed or is invalid' }, { status: 400 });
    }

    // Increment unlocks
    await updateContent(id, { totalUnlocks: (content.totalUnlocks || 0) + 1 });

    // Record the purchase unlock
    await recordUnlock({
      id: `unlock_${Math.random().toString(36).substring(2, 9)}`,
      contentId: id,
      buyerAddress,
      txId,
      purchasedAt: Date.now()
    });

    // --- Affiliate Logic ---
    // If a referrer is provided, give them a 10% commission on the unlock price
    if (referrerAddress && referrerAddress !== buyerAddress) {
      const commissionAmount = content.priceInSTX * 0.10;
      await addReferralEarning({
        referrerAddress,
        contentId: id,
        buyerAddress,
        amountSTX: commissionAmount
      });
      console.log(`[AFFILIATE] Granted ${commissionAmount} STX commission to ${referrerAddress}`);
    }

    return NextResponse.json({ success: true, message: 'Content unlocked and verified' });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
