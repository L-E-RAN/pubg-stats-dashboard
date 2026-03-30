import { NextRequest, NextResponse } from 'next/server';
import { comparePlayers, resolveShard } from '@/lib/pubg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const names = Array.isArray(body.names) ? body.names : [];
    const shard = resolveShard(typeof body.shard === 'string' ? body.shard : 'psn');

    if (!names.length) {
      return NextResponse.json({ error: 'No player names provided.' }, { status: 400 });
    }

    const response = await comparePlayers(names, shard);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
