import type { Metadata } from 'next';
import Link from 'next/link';
import { getMatchOverview, resolveShard } from '@/lib/pubg';
import { MatchParticipantsTable } from '@/components/MatchParticipantsTable';
import { StatCard } from '@/components/StatCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Match ${id.slice(0, 8)}… — PUBG Stats Dashboard`,
    description: `פרטי משחק PUBG — משתתפים, סטטיסטיקות ו-telemetry.`,
  };
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const shard = resolveShard(Array.isArray(resolvedSearch.shard) ? resolvedSearch.shard[0] : resolvedSearch.shard);

  try {
    const match = await getMatchOverview(decodeURIComponent(id), shard);
    const winner = match.participants.find((player) => player.winPlace === 1);
    const killLeader = match.participants[0] ? [...match.participants].sort((a, b) => b.kills - a.kills)[0] : undefined;
    const damageLeader = match.participants[0] ? [...match.participants].sort((a, b) => b.damageDealt - a.damageDealt)[0] : undefined;

    return (
      <main className="page">
        <div className="container stack-lg">
          <div className="card hero-card">
            <div className="header-row">
              <div>
                <span className="badge">פרטי משחק</span>
                <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', marginTop: 14 }}>{match.mapName}</h1>
                <p className="subtle" style={{ marginTop: 12 }}>
                  {match.gameMode} · {match.matchType} · {new Date(match.createdAt).toLocaleString('he-IL')} · shard {match.shardId}
                </p>
              </div>
              <div className="header-actions">
                <span className="pill">Match ID: {match.id}</span>
                <Link href="/" className="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>חיפוש חדש</Link>
              </div>
            </div>
          </div>

          <div className="grid kpi-grid">
            <StatCard label="משך משחק" value={formatDuration(match.duration)} />
            <StatCard label="משתתפים" value={String(match.participantCount)} />
            <StatCard label="קבוצות" value={String(match.rosterCount)} />
            <StatCard label="מנצח" value={winner?.name ?? 'Unknown'} />
          </div>

          <div className="grid dual-grid">
            <div className="card section-card">
              <div className="section-title">
                <h2>Telemetry</h2>
                <span className="pill">סיכום אירועים</span>
              </div>
              {match.telemetrySummary ? (
                <div className="small-list">
                  <div className="small-item"><span>סה״כ אירועים</span><strong>{match.telemetrySummary.totalEvents.toLocaleString()}</strong></div>
                  <div className="small-item"><span>סוגי אירועים</span><strong>{match.telemetrySummary.eventTypeCount.toLocaleString()}</strong></div>
                  <div className="small-item"><span>אירועי Kill</span><strong>{match.telemetrySummary.killsLogged.toLocaleString()}</strong></div>
                  <div className="small-item"><span>Knockdowns</span><strong>{match.telemetrySummary.knockdownsLogged.toLocaleString()}</strong></div>
                  <div className="small-item"><span>Phase changes</span><strong>{match.telemetrySummary.phaseChanges.toLocaleString()}</strong></div>
                </div>
              ) : (
                <div className="muted-box">לא ניתן היה לסכם את telemetry בסביבה הזו, אבל קישור ה-asset יופיע למטה אם הוא זמין.</div>
              )}

              {match.telemetryUrl ? (
                <p className="subtle link-wrap" style={{ marginTop: 16 }}>{match.telemetryUrl}</p>
              ) : null}
            </div>

            <div className="card section-card">
              <div className="section-title">
                <h2>עובדות מהירות</h2>
                <span className="pill">Snapshot</span>
              </div>
              <div className="small-list">
                <div className="small-item"><span>מקום ראשון</span><strong>{winner?.name ?? 'Unknown'}</strong></div>
                <div className="small-item"><span>מוביל הריגות</span><strong>{killLeader ? `${killLeader.name} · ${killLeader.kills}` : '0'}</strong></div>
                <div className="small-item"><span>מוביל נזק</span><strong>{damageLeader ? `${damageLeader.name} · ${damageLeader.damageDealt.toFixed(0)}` : '0'}</strong></div>
                <div className="small-item"><span>הירייה הארוכה ביותר</span><strong>{match.participants.length ? `${Math.max(...match.participants.map((p) => p.longestKill)).toFixed(0)} m` : '0 m'}</strong></div>
              </div>

              {match.telemetrySummary?.topEventTypes?.length ? (
                <div className="top-event-list">
                  {match.telemetrySummary.topEventTypes.map((event) => (
                    <div className="small-item" key={event.type}>
                      <span>{event.type}</span>
                      <strong>{event.count.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <MatchParticipantsTable participants={match.participants} />
        </div>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load this match.';
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
