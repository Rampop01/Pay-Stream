import { NextResponse } from 'next/server';
import { getContent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allContent = await getContent();
    
    // Generate realistic simulated activity
    const activities = [];
    const eventTypes = ['unlock', 'tip', 'stake'];
    
    for (let i = 0; i < 5; i++) {
      const content = allContent[Math.floor(Math.random() * allContent.length)];
      if (!content) continue;
      
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomWallet = `SP${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      let message = '';
      if (type === 'unlock') {
        message = `${randomWallet} just unlocked "${content.title}" for ${content.priceInSTX} STX`;
      } else if (type === 'tip') {
        const tip = (Math.random() * 5).toFixed(1);
        message = `${randomWallet} sent a ${tip} STX tip to the creator of "${content.title}"`;
      } else {
        const stake = (Math.random() * 100).toFixed(0);
        message = `${randomWallet} staked ${stake} STX on creator profile`;
      }
      
      activities.push({
        id: `act_${Date.now()}_${i}`,
        message,
        timestamp: Date.now() - Math.floor(Math.random() * 600000), // Within last 10 mins
        type
      });
    }

    // Sort by most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(activities);
  } catch (error) {
    console.error('[Activity API] Failed to generate activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
