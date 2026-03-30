import { MatchParticipantSummary } from '@/lib/types';

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}ד ${secs}ש`;
}

type Props = {
  participants: MatchParticipantSummary[];
};

export function MatchParticipantsTable({ participants }: Props) {
  return (
    <div className="card section-card">
      <div className="section-title">
        <h2>משתתפים</h2>
        <span className="pill">{participants.length} שחקנים</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="stat-table wide-table">
          <thead>
            <tr>
              <th>מקום</th>
              <th>שחקן</th>
              <th>קבוצה</th>
              <th>הריגות</th>
              <th>סיוע</th>
              <th>נזק</th>
              <th>יריות ראש</th>
              <th>החייאות</th>
              <th>הפלות</th>
              <th>ירייה ארוכה</th>
              <th>זמן שרידות</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={`${participant.accountId}-${participant.name}`}>
                <td>{participant.winPlace ?? '-'}</td>
                <td>{participant.name}</td>
                <td>{participant.teamId ?? '-'}</td>
                <td>{participant.kills}</td>
                <td>{participant.assists}</td>
                <td>{participant.damageDealt.toFixed(0)}</td>
                <td>{participant.headshotKills}</td>
                <td>{participant.revives}</td>
                <td>{participant.dbnos}</td>
                <td>{participant.longestKill.toFixed(0)} m</td>
                <td>{formatDuration(participant.timeSurvived)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
