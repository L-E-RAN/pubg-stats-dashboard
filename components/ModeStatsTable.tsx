import { PlayerModeStats } from '@/lib/types';

const LABELS: Array<[keyof PlayerModeStats, string]> = [
  ['roundsPlayed', 'Rounds'],
  ['wins', 'Wins'],
  ['kills', 'Kills'],
  ['killDeathRatio', 'K/D'],
  ['damageDealt', 'Damage'],
  ['top10s', 'Top 10'],
  ['headshotKills', 'Headshots'],
  ['revives', 'Revives'],
  ['longestKill', 'Longest Kill'],
  ['timeSurvived', 'Time Survived (sec)'],
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
        <span className="pill">{stats.roundsPlayed} rounds</span>
      </div>
      <table className="stat-table">
        <tbody>
          {LABELS.map(([key, label]) => (
            <tr key={key}>
              <th>{label}</th>
              <td>{Number(stats[key]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
