'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlatformShard } from '@/lib/types';

const EMPTY_COMPARE = ['', '', ''];
const STORAGE_KEY = 'pubg-default-shard';

export function SearchPanel() {
  const router = useRouter();
  const [mainPlayer, setMainPlayer] = useState('');
  const [comparePlayers, setComparePlayers] = useState<string[]>(EMPTY_COMPARE);
  const [shard, setShard] = useState<PlatformShard>('psn');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'psn' || saved === 'xbox' || saved === 'steam') {
      setShard(saved);
    }
  }, []);

  const updateShard = (value: PlatformShard) => {
    setShard(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  const buildPlayerUrl = (names: string[]) => {
    const [main, ...others] = names;
    const query = new URLSearchParams();
    query.set('shard', shard);
    if (others.length) {
      query.set('compare', others.join(','));
    }
    return `/player/${encodeURIComponent(main)}?${query.toString()}`;
  };

  const submitSingle = (event: FormEvent) => {
    event.preventDefault();
    const clean = mainPlayer.trim();
    if (!clean) return;
    router.push(buildPlayerUrl([clean]));
  };

  const submitCompare = (event: FormEvent) => {
    event.preventDefault();
    const names = [mainPlayer, ...comparePlayers].map((item) => item.trim()).filter(Boolean).slice(0, 4);
    if (!names.length) return;
    router.push(buildPlayerUrl(names));
  };

  return (
    <div className="card search-panel">
      <div>
        <h3>חיפוש שחקני PUBG</h3>
        <p className="subtle" style={{ marginTop: 8 }}>
          חיפוש שחקן בודד או השוואה בין עד 4 שחקנים, עם מעבר בין PlayStation, Xbox ו-Steam.
        </p>
      </div>

      <label className="stack-sm">
        <span className="label-text">פלטפורמה</span>
        <select className="select" value={shard} onChange={(event) => updateShard(event.target.value as PlatformShard)}>
          <option value="psn">PlayStation (PSN)</option>
          <option value="xbox">Xbox</option>
          <option value="steam">Steam (PC)</option>
        </select>
      </label>

      <form onSubmit={submitSingle} className="grid" style={{ gap: 12 }}>
        <input
          className="input"
          value={mainPlayer}
          onChange={(event) => setMainPlayer(event.target.value)}
          placeholder="שם השחקן הראשי"
        />
        <div className="field-row">
          <button className="button" type="submit">פתח דשבורד שחקן</button>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setMainPlayer('');
              setComparePlayers(EMPTY_COMPARE);
              updateShard('psn');
            }}
          >
            נקה
          </button>
        </div>
      </form>

      <form onSubmit={submitCompare} className="grid" style={{ gap: 12 }}>
        <div className="compare-slots">
          {comparePlayers.map((value, index) => (
            <input
              key={index}
              className="input"
              value={value}
              onChange={(event) => {
                const next = [...comparePlayers];
                next[index] = event.target.value;
                setComparePlayers(next);
              }}
              placeholder={`שחקן להשוואה ${index + 1}`}
            />
          ))}
        </div>
        <button className="button" type="submit">השווה עד 4 שחקנים</button>
      </form>
    </div>
  );
}
