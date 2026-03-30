import { PlatformShard } from '@/lib/types';

export type FavoritePlayer = {
  name: string;
  shard: PlatformShard;
  addedAt: string;
};

const STORAGE_KEY = 'pubg-favorite-players';
const MAX_FAVORITES = 12;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readFavorites(): FavoritePlayer[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoritePlayer[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.name === 'string' && typeof item.shard === 'string');
  } catch {
    return [];
  }
}

export function writeFavorites(items: FavoritePlayer[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_FAVORITES)));
}

export function isFavorite(name: string, shard: PlatformShard) {
  return readFavorites().some(
    (item) => item.name.toLowerCase() === name.trim().toLowerCase() && item.shard === shard,
  );
}

export function toggleFavorite(name: string, shard: PlatformShard) {
  const cleanName = name.trim();
  const current = readFavorites();
  const exists = current.some(
    (item) => item.name.toLowerCase() === cleanName.toLowerCase() && item.shard === shard,
  );

  if (exists) {
    const next = current.filter(
      (item) => !(item.name.toLowerCase() === cleanName.toLowerCase() && item.shard === shard),
    );
    writeFavorites(next);
    return next;
  }

  const next = [{ name: cleanName, shard, addedAt: new Date().toISOString() }, ...current];
  const deduped = next.filter(
    (item, index, arr) =>
      arr.findIndex(
        (candidate) =>
          candidate.name.toLowerCase() === item.name.toLowerCase() && candidate.shard === item.shard,
      ) === index,
  );

  writeFavorites(deduped);
  return deduped;
}

export function shardLabel(shard: PlatformShard) {
  switch (shard) {
    case 'psn':
      return 'PlayStation';
    case 'xbox':
      return 'Xbox';
    case 'steam':
      return 'Steam';
    default:
      return shard;
  }
}
