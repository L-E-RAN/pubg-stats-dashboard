'use client';

import { useEffect, useState } from 'react';
import { PlatformShard } from '@/lib/types';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

type Props = {
  name: string;
  shard: PlatformShard;
};

export function FavoritePlayerButton({ name, shard }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(name, shard));
  }, [name, shard]);

  return (
    <button
      type="button"
      className={`button ${saved ? '' : 'secondary'}`}
      onClick={() => {
        toggleFavorite(name, shard);
        setSaved((prev) => !prev);
      }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {saved ? 'הסר ממועדפים' : 'שמור במועדפים'}
    </button>
  );
}
