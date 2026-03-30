import { PlayerOverview } from '@/lib/types';

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';
}

type Props = {
  players: PlayerOverview[];
};

const METRICS = [
  { label: 'ניצחונות', getValue: (player: PlayerOverview) => player.summary.totalWins },
  { label: 'הריגות', getValue: (player: PlayerOverview) => player.summary.totalKills },
  { label: 'נזק ממוצע', getValue: (player: PlayerOverview) => player.summary.avgDamage },
  { label: 'K/D', getValue: (player: PlayerOverview) => player.summary.kd },
  { label: 'רמת הישרדות', getValue: (player: PlayerOverview) => player.survival?.level ?? 0 },
];

function ComparisonBars({ players }: Props) {
  return (
    <div className="chart-stack">
      {METRICS.map((metric) => {
        const values = players.map((player) => metric.getValue(player));
        const max = Math.max(...values, 1);

        return (
          <div className="chart-card" key={metric.label}>
            <div className="section-title" style={{ marginBottom: 12 }}>
              <h3>{metric.label}</h3>
              <span className="pill">השוואה ויזואלית</span>
            </div>
            <div className="bar-chart-list">
              {players.map((player) => {
                const value = metric.getValue(player);
                const width = Math.max((value / max) * 100, value > 0 ? 8 : 0);
                return (
                  <div className="bar-row" key={`${metric.label}-${player.accountId}`}>
                    <div className="bar-label-row">
                      <span>{player.name}</span>
                      <strong>{formatNumber(value)}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CompareBoard({ players }: Props) {
  return (
    <div className="card section-card">
      <div className="section-title">
        <h2>לוח השוואה</h2>
        <span className="pill">עד 4 שחקנים</span>
      </div>

      <div className="compare-summary-grid">
        {METRICS.map((metric) => {
          const winner = [...players].sort((a, b) => metric.getValue(b) - metric.getValue(a))[0];
          return (
            <div className="kpi" key={metric.label}>
              <span className="label">מוביל · {metric.label}</span>
              <span className="value" style={{ fontSize: 22 }}>{winner?.name ?? 'N/A'}</span>
            </div>
          );
        })}
      </div>

      <div className="grid compare-grid" style={{ marginTop: 20 }}>
        {players.map((player) => (
          <div className="compare-card" key={player.accountId}>
            <div className="compare-header-row">
              <div>
                <h3>{player.name}</h3>
                <p className="subtle" style={{ marginTop: 6 }}>{player.platformLabel}</p>
              </div>
              <span className="pill">{player.summary.bestMode}</span>
            </div>

            <div className="small-list">
              <div className="small-item"><span>ניצחונות</span><strong>{formatNumber(player.summary.totalWins)}</strong></div>
              <div className="small-item"><span>הריגות</span><strong>{formatNumber(player.summary.totalKills)}</strong></div>
              <div className="small-item"><span>נזק ממוצע</span><strong>{formatNumber(player.summary.avgDamage)}</strong></div>
              <div className="small-item"><span>K/D</span><strong>{formatNumber(player.summary.kd)}</strong></div>
              <div className="small-item"><span>רמת הישרדות</span><strong>{formatNumber(player.survival?.level ?? 0)}</strong></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <ComparisonBars players={players} />
      </div>
    </div>
  );
}
