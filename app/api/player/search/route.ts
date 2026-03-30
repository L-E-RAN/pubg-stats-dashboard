import { NextRequest, NextResponse } from 'next/server';
import { getPlayerOverview, resolveShard } from '@/lib/pubg';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');
  const shard = resolveShard(request.nextUrl.searchParams.get('shard'));

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Missing player name.' }, { status: 400 });
  }

  try {
    const player = await getPlayerOverview(name, shard);
    return NextResponse.json(player);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
