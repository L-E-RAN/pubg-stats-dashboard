import { PlayerOverview } from '@/lib/types';
import { StatCard } from '@/components/StatCard';

function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

type Props = {
  player: PlayerOverview;
};

export function OverviewSection({ player }: Props) {
  return (
    <>
      <div className="grid kpi-grid">
        <StatCard label="Season wins" value={formatNumber(player.summary.totalWins)} />
        <StatCard label="Season kills" value={formatNumber(player.summary.totalKills)} />
        <StatCard label="Average damage" value={formatNumber(player.summary.avgDamage)} />
        <StatCard label="K/D" value={formatNumber(player.summary.kd)} />
      </div>

      <div className="grid dual-grid" style={{ marginTop: 20 }}>
        <div className="card section-card">
          <div className="section-title">
            <h2>Mastery</h2>
            <span className="pill">Highlights</span>
          </div>
          <div className="small-list">
            <div className="small-item"><span>Survival level</span><strong>{player.survival?.level ?? 'N/A'}</strong></div>
            <div className="small-item"><span>Survival XP</span><strong>{player.survival?.xp?.toLocaleString() ?? 'N/A'}</strong></div>
            <div className="small-item"><span>Total survival matches</span><strong>{player.survival?.totalMatchesPlayed?.toLocaleString() ?? 'N/A'}</strong></div>
          </div>
        </div>

        <div className="card section-card">
          <div className="section-title">
            <h2>Top weapon mastery</h2>
            <span className="pill">Top 5</span>
          </div>
          {player.weaponMasteryTop.length === 0 ? (
            <div className="muted-box">No weapon mastery data returned by the API.</div>
          ) : (
            <div className="small-list">
              {player.weaponMasteryTop.map((weapon) => (
                <div className="small-item" key={weapon.weapon}>
                  <span>{weapon.weapon}</span>
                  <strong>L{weapon.level} · {weapon.xpTotal.toLocaleString()} XP</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
