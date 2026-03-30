import Link from 'next/link';
import { PlatformShard } from '@/lib/types';

type Props = {
  matches: Array<{ id: string; shard: PlatformShard; createdAt?: string }>;
};

export function MatchList({ matches }: Props) {
  return (
    <div className="card section-card">
      <div className="section-title">
        <h2>משחקים אחרונים</h2>
        <span className="pill">אחרונים {matches.length}</span>
      </div>

      {matches.length === 0 ? (
        <div className="muted-box">לא הוחזרו משחקים אחרונים לשחקן הזה.</div>
      ) : (
        <div className="match-list">
          {matches.map((match, index) => (
            <Link className="match-row" href={`/match/${encodeURIComponent(match.id)}?shard=${match.shard}`} key={match.id}>
              <div>
                <span className="label-text">משחק #{index + 1}</span>
                <strong>{match.id}</strong>
              </div>
              <span className="pill">פתח משחק</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
