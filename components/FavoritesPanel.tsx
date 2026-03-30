'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FavoritePlayer, readFavorites, shardLabel } from '@/lib/favorites';
import { PlatformShard } from '@/lib/types';

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const compareGroups = useMemo(() => {
    const groups = new Map<PlatformShard, FavoritePlayer[]>();

    for (const item of favorites) {
      const existing = groups.get(item.shard) ?? [];
      existing.push(item);
      groups.set(item.shard, existing);
    }

    return [...groups.entries()]
      .map(([shard, players]) => ({ shard, players: players.slice(0, 4) }))
      .filter((group) => group.players.length >= 2);
  }, [favorites]);

  return (
    <section className="card section-card stack-md">
      <div className="section-title">
        <h2>מועדפים</h2>
        <span className="pill">{favorites.length} שמורים</span>
      </div>

      {favorites.length === 0 ? (
        <div className="muted-box">
          שמור שחקנים ממסך השחקן, וכאן תקבל גישה מהירה אליהם והשוואות מוכנות מראש.
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <Link
              key={`${item.shard}-${item.name}`}
              className="favorite-card"
              href={`/player/${encodeURIComponent(item.name)}?shard=${item.shard}`}
            >
              <div>
                <strong>{item.name}</strong>
                <p className="subtle" style={{ marginTop: 6 }}>
                  {shardLabel(item.shard)}
                </p>
              </div>
              <span className="pill">פתח</span>
            </Link>
          ))}
        </div>
      )}

      {compareGroups.length > 0 ? (
        <div className="stack-sm">
          <div className="section-title" style={{ marginBottom: 0 }}>
            <h3>השוואות מהירות</h3>
            <span className="pill">מוכן בלחיצה</span>
          </div>

          <div className="favorites-grid">
            {compareGroups.map((group) => {
              const [main, ...rest] = group.players;
              const query = new URLSearchParams();
              query.set('shard', group.shard);
              query.set('compare', rest.map((item) => item.name).join(','));
              return (
                <Link
                  key={`compare-${group.shard}`}
                  className="favorite-card"
                  href={`/player/${encodeURIComponent(main.name)}?${query.toString()}`}
                >
                  <div>
                    <strong>{group.players.map((item) => item.name).join(' · ')}</strong>
                    <p className="subtle" style={{ marginTop: 6 }}>
                      {shardLabel(group.shard)}
                    </p>
                  </div>
                  <span className="pill">השווה</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
