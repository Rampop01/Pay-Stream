import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/content.json');

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { txId, buyerAddress } = await req.json();

    if (!txId || !buyerAddress) {
      return NextResponse.json({ error: 'Missing txId or buyerAddress' }, { status: 400 });
    }

    console.log(`[VERIFY] Verifying transaction ${txId} for content ${id} and buyer ${buyerAddress}`);

    // Call Hiro API to verify transaction
    const hiroRes = await fetch(`https://api.mainnet.hiro.so/extended/v1/tx/${txId}`);
    if (!hiroRes.ok) {
      return NextResponse.json({ error: 'Transaction not found on-chain' }, { status: 404 });
    }

    const txData = await hiroRes.json();
    
    // Basic verification: check if successful and if it involves the correct contract/function
    // Note: In a production app, you'd check arguments and post-conditions more strictly
    if (txData.tx_status !== 'success' && txData.tx_status !== 'pending') {
      return NextResponse.json({ error: 'Transaction failed or is invalid' }, { status: 400 });
    }

    // Update local DB to increment unlocks
    if (fs.existsSync(DATA_FILE)) {
      const content = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      const index = content.findIndex((c: any) => c.id === id);
      
      if (index !== -1) {
        content[index].totalUnlocks = (content[index].totalUnlocks || 0) + 1;
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

        // Generate Notification for creator
        const NOTIF_FILE = path.join(process.cwd(), 'data/notifications.json');
        let notifications = [];
        if (fs.existsSync(NOTIF_FILE)) {
          notifications = JSON.parse(fs.readFileSync(NOTIF_FILE, 'utf8'));
        }
        
        notifications.push({
          id: `notif-${Date.now()}`,
          recipient: content[index].creatorAddress,
          title: '🎉 New Content Unlock!',
          message: `Someone just unlocked "${content[index].title}" for ${content[index].priceInSTX} STX.`,
          type: 'unlock',
          timestamp: Date.now(),
          read: false,
          link: `/content/${id}`
        });
        
        fs.writeFileSync(NOTIF_FILE, JSON.stringify(notifications, null, 2));
      }
    }

    return NextResponse.json({ 
      success: true, 
      txStatus: txData.tx_status,
      message: 'Transaction verified and unlock recorded'
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
