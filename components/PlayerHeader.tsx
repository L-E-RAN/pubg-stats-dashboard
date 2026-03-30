import Link from 'next/link';
import { PlayerOverview } from '@/lib/types';
import { FavoritePlayerButton } from '@/components/FavoritePlayerButton';

type Props = {
  player: PlayerOverview;
};

export function PlayerHeader({ player }: Props) {
  return (
    <div className="card hero-card">
      <div className="header-row">
        <div>
          <span className="badge">{player.platformLabel}</span>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', marginTop: 14 }}>{player.name}</h1>
          <p className="subtle" style={{ marginTop: 12 }}>
            עונה נוכחית: {player.seasonId} · Ranked: {player.rankedSeasonId}
          </p>
        </div>
        <div className="header-actions">
          <span className="pill">Shard: {player.shard}</span>
          <span className="pill">עודכן: {new Date(player.lastUpdated).toLocaleString('he-IL')}</span>
          <FavoritePlayerButton name={player.name} shard={player.shard} />
          <Link href="/" className="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>חיפוש חדש</Link>
        </div>
      </div>
    </div>
  );
}
