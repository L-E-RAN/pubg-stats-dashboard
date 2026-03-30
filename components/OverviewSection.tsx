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
        <StatCard label="ניצחונות (עונה)" value={formatNumber(player.summary.totalWins)} />
        <StatCard label="הריגות (עונה)" value={formatNumber(player.summary.totalKills)} />
        <StatCard label="נזק ממוצע" value={formatNumber(player.summary.avgDamage)} />
        <StatCard label="K/D" value={player.summary.kd.toFixed(2)} />
      </div>

      <div className="grid dual-grid" style={{ marginTop: 20 }}>
        <div className="card section-card">
          <div className="section-title">
            <h2>שליטה</h2>
            <span className="pill">הישרדות</span>
          </div>
          <div className="small-list">
            <div className="small-item"><span>רמת הישרדות</span><strong>{player.survival?.level ?? 'N/A'}</strong></div>
            <div className="small-item"><span>XP הישרדות</span><strong>{player.survival?.xp?.toLocaleString() ?? 'N/A'}</strong></div>
            <div className="small-item"><span>סה״כ משחקי הישרדות</span><strong>{player.survival?.totalMatchesPlayed?.toLocaleString() ?? 'N/A'}</strong></div>
          </div>
        </div>

        <div className="card section-card">
          <div className="section-title">
            <h2>שליטת נשק</h2>
            <span className="pill">טופ 5</span>
          </div>
          {player.weaponMasteryTop.length === 0 ? (
            <div className="muted-box">אין נתוני שליטת נשק.</div>
          ) : (
            <div className="small-list">
              {player.weaponMasteryTop.map((weapon) => (
                <div className="small-item" key={weapon.weapon}>
                  <span>{weapon.weapon}</span>
                  <strong>רמה {weapon.level} · {weapon.xpTotal.toLocaleString()} XP</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
