import { PlayerModeStats } from '@/lib/types';

function formatValue(key: keyof PlayerModeStats, value: number): string {
  if (key === 'timeSurvived') {
    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const mins = Math.floor((value % 3600) / 60);
    if (days > 0) return `${days}י ${hours}ש ${mins}ד`;
    if (hours > 0) return `${hours}ש ${mins}ד`;
    return `${mins}ד`;
  }
  if (key === 'killDeathRatio') return value.toFixed(2);
  if (key === 'longestKill') return `${value.toFixed(0)} מ׳`;
  if (key === 'damageDealt') return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const LABELS: Array<[keyof PlayerModeStats, string]> = [
  ['roundsPlayed', 'סיבובים'],
  ['wins', 'ניצחונות'],
  ['kills', 'הריגות'],
  ['killDeathRatio', 'K/D'],
  ['damageDealt', 'נזק'],
  ['top10s', 'עשרה ראשונים'],
  ['headshotKills', 'יריות ראש'],
  ['revives', 'החייאות'],
  ['longestKill', 'ירייה ארוכה'],
  ['timeSurvived', 'זמן שרידות'],
];

type Props = {
  title: string;
  stats: PlayerModeStats;
};

export function ModeStatsTable({ title, stats }: Props) {
  return (
    <div className="card section-card">
      <div className="section-title">
        <h3>{title}</h3>
        <span className="pill">{stats.roundsPlayed} סיבובים</span>
      </div>
      <table className="stat-table">
        <tbody>
          {LABELS.map(([key, label]) => (
            <tr key={key}>
              <th>{label}</th>
              <td>{formatValue(key, Number(stats[key]))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
