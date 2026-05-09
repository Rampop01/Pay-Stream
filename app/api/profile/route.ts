import { NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    if (!address) return NextResponse.json({ error: 'Missing address' }, { status: 400 });

    const profile = await getProfile(address);
    return NextResponse.json(profile || { address });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const profile = await request.json();
    if (!profile.address) return NextResponse.json({ error: 'Missing address' }, { status: 400 });

    await updateProfile(profile);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
