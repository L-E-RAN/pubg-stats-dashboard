import type { Metadata } from 'next';
import Link from 'next/link';
import { comparePlayers, getPlayerOverview, resolveShard } from '@/lib/pubg';
import { PlayerHeader } from '@/components/PlayerHeader';
import { OverviewSection } from '@/components/OverviewSection';
import { ModeStatsTable } from '@/components/ModeStatsTable';
import { CompareBoard } from '@/components/CompareBoard';
import { MatchList } from '@/components/MatchList';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} — PUBG Stats Dashboard`,
    description: `סטטיסטיקות PUBG עבור ${decodedName} — עונה נוכחית, ranked, lifetime ועוד.`,
  };
}

function parseCompare(raw?: string | string[]) {
  const joined = Array.isArray(raw) ? raw.join(',') : raw ?? '';
  return joined.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 3);
}

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { name } = await params;
  const resolvedSearch = await searchParams;
  const compareNames = parseCompare(resolvedSearch.compare);
  const decodedName = decodeURIComponent(name);
  const shard = resolveShard(Array.isArray(resolvedSearch.shard) ? resolvedSearch.shard[0] : resolvedSearch.shard);

  try {
    const [player, compare] = await Promise.all([
      getPlayerOverview(decodedName, shard),
      compareNames.length ? comparePlayers([decodedName, ...compareNames], shard) : Promise.resolve(null),
    ]);

    const seasonModes = Object.entries(player.gameModes).filter(([, stats]) => stats.roundsPlayed > 0);
    const rankedModes = Object.entries(player.rankedGameModes).filter(([, stats]) => stats.roundsPlayed > 0);
    const lifetimeModes = Object.entries(player.lifeTime ?? {}).filter(([, stats]) => stats.roundsPlayed > 0);

    return (
      <main className="page">
        <div className="container stack-lg">
          <PlayerHeader player={player} />

          {compare && compare.failed.length > 0 ? (
            <div className="notice warn">
              חלק מהשחקנים לא נטענו: {compare.failed.map((item) => `${item.name} (${item.reason})`).join(', ')}
            </div>
          ) : null}

          {compare && compare.players.length > 1 ? <CompareBoard players={compare.players} /> : null}

          <OverviewSection player={player} />

          <section className="stack-md">
            <div className="section-title" style={{ marginBottom: 0 }}>
              <h2>עונה נוכחית</h2>
              <span className="pill">{seasonModes.length} מצבים פעילים</span>
            </div>
            <div className="grid mode-grid">
              {seasonModes.length ? seasonModes.map(([mode, stats]) => <ModeStatsTable key={mode} title={mode} stats={stats} />) : <div className="muted-box">לא הוחזרו נתוני עונה נוכחית.</div>}
            </div>
          </section>

          <section className="stack-md">
            <div className="section-title" style={{ marginBottom: 0 }}>
              <h2>דירוג תחרותי</h2>
              <span className="pill">Ranked</span>
            </div>
            <div className="grid mode-grid">
              {rankedModes.length ? rankedModes.map(([mode, stats]) => <ModeStatsTable key={mode} title={mode} stats={stats} />) : <div className="muted-box">אין נתוני דירוג לעונה זו.</div>}
            </div>
          </section>

          <section className="stack-md">
            <div className="section-title" style={{ marginBottom: 0 }}>
              <h2>קריירה</h2>
              <span className="pill">Lifetime</span>
            </div>
            <div className="grid mode-grid">
              {lifetimeModes.length ? lifetimeModes.map(([mode, stats]) => <ModeStatsTable key={mode} title={mode} stats={stats} />) : <div className="muted-box">אין נתוני קריירה.</div>}
            </div>
          </section>

          <MatchList matches={player.recentMatches} />

          <div className="card section-card">
            <div className="section-title">
              <h2>קישור שיתוף</h2>
              <span className="pill">URL</span>
            </div>
            <p className="subtle link-wrap">
              /player/{encodeURIComponent(player.name)}?shard={player.shard}
              {compareNames.length ? `&compare=${compareNames.map((item) => encodeURIComponent(item)).join(',')}` : ''}
            </p>
            <div style={{ marginTop: 16 }}>
              <Link className="button" href="/">חזרה לחיפוש</Link>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load this player.';
    return (
      <main className="page">
        <div className="container">
          <div className="card section-card stack-md">
            <div className="notice warn">{message}</div>
            <div>
              <Link className="button" href="/">חזרה לחיפוש</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
