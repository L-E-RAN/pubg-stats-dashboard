import {
  MatchOverview,
  MatchParticipantSummary,
  PlatformShard,
  PlayerOverview,
  PlayerModeStats,
  TelemetrySummary,
} from '@/lib/types';

const PUBG_API_BASE = 'https://api.pubg.com';
const DEFAULT_PLATFORM: PlatformShard = 'psn';
const PLATFORM_LABELS: Record<PlatformShard, string> = {
  psn: 'PlayStation (PSN)',
  xbox: 'Xbox',
  steam: 'Steam (PC)',
};

function getApiKey() {
  const apiKey = process.env.PUBG_API_KEY;

  if (!apiKey) {
    throw new Error('Missing PUBG_API_KEY in environment variables.');
  }

  return apiKey;
}

function isPlatformShard(value: string | null | undefined): value is PlatformShard {
  return value === 'psn' || value === 'xbox' || value === 'steam';
}

export function resolveShard(value?: string | null): PlatformShard {
  return isPlatformShard(value) ? value : DEFAULT_PLATFORM;
}

async function pubgFetch<T>(path: string, requireAuth = true): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.api+json',
  };

  if (requireAuth) {
    headers.Authorization = `Bearer ${getApiKey()}`;
  }

  const response = await fetch(`${PUBG_API_BASE}${path}`, {
    headers,
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PUBG API ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

type SeasonListResponse = {
  data: Array<{
    id: string;
    attributes: {
      isCurrentSeason: boolean;
      isOffseason: boolean;
    };
  }>;
};

type PlayerLookupResponse = {
  data: Array<{
    id: string;
    attributes: {
      name: string;
      patchVersion: string;
      shardId: string;
      titleId: string;
    };
    relationships?: {
      matches?: {
        data?: Array<{ id: string; type: string }>;
      };
    };
  }>;
};

type SeasonStatsResponse = {
  data: {
    attributes: {
      gameModeStats: Record<string, Partial<PlayerModeStats>>;
    };
  };
};

type SurvivalResponse = {
  data: {
    attributes: {
      stats: {
        level: number;
        xp: number;
        totalMatchesPlayed: number;
      };
    };
  };
};

type WeaponResponse = {
  data: {
    attributes: {
      weaponSummaries: Record<
        string,
        {
          StatsTotal: {
            XPTotal: number;
          };
          WeaponMasteryLevel: number;
        }
      >;
    };
  };
};

type MatchResponse = {
  data: {
    id: string;
    attributes: {
      mapName: string;
      gameMode: string;
      matchType: string;
      duration: number;
      createdAt: string;
      shardId: string;
    };
    relationships?: {
      assets?: {
        data?: Array<{ id: string; type: string }>;
      };
      participants?: {
        data?: Array<{ id: string; type: string }>;
      };
      rosters?: {
        data?: Array<{ id: string; type: string }>;
      };
    };
  };
  included?: Array<{
    type: string;
    id: string;
    attributes?: Record<string, unknown>;
  }>;
};

function sanitizePlayerName(name: string) {
  return encodeURIComponent(name.trim());
}

function normalizeModeStats(input?: Partial<PlayerModeStats>): PlayerModeStats {
  const kills = input?.kills ?? 0;
  const losses = input?.losses ?? 0;
  const kdFromApi = input?.killDeathRatio ?? 0;
  const killDeathRatio = kdFromApi > 0 ? kdFromApi : losses > 0 ? kills / losses : kills;

  return {
    wins: input?.wins ?? 0,
    top10s: input?.top10s ?? 0,
    kills,
    assists: input?.assists ?? 0,
    dBNOs: input?.dBNOs ?? 0,
    roundsPlayed: input?.roundsPlayed ?? 0,
    damageDealt: input?.damageDealt ?? 0,
    headshotKills: input?.headshotKills ?? 0,
    longestKill: input?.longestKill ?? 0,
    revives: input?.revives ?? 0,
    timeSurvived: input?.timeSurvived ?? 0,
    losses,
    killDeathRatio,
  };
}

function buildSummary(gameModes: Record<string, PlayerModeStats>) {
  const entries = Object.entries(gameModes).filter(([, stats]) => stats.roundsPlayed > 0);

  const totals = entries.reduce(
    (acc, [, stats]) => {
      acc.wins += stats.wins;
      acc.kills += stats.kills;
      acc.damage += stats.damageDealt;
      acc.rounds += stats.roundsPlayed;
      acc.losses += stats.losses;
      return acc;
    },
    { wins: 0, kills: 0, damage: 0, rounds: 0, losses: 0 },
  );

  const bestMode = [...entries].sort((a, b) => b[1].kills - a[1].kills)[0]?.[0] ?? 'N/A';

  return {
    totalWins: totals.wins,
    totalKills: totals.kills,
    avgDamage: totals.rounds ? totals.damage / totals.rounds : 0,
    kd: totals.losses ? totals.kills / totals.losses : totals.kills,
    bestMode,
  };
}

const seasonCache = new Map<string, { id: string; expires: number }>();
const SEASON_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getCurrentSeasonId(shard: PlatformShard = DEFAULT_PLATFORM) {
  const cached = seasonCache.get(shard);
  if (cached && Date.now() < cached.expires) {
    return cached.id;
  }

  const seasonList = await pubgFetch<SeasonListResponse>(`/shards/${shard}/seasons`);
  const current = seasonList.data.find((season) => season.attributes.isCurrentSeason);

  if (!current) {
    throw new Error('Could not resolve current PUBG season.');
  }

  seasonCache.set(shard, { id: current.id, expires: Date.now() + SEASON_CACHE_TTL });
  return current.id;
}

function numberOrZero(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function nullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function buildTelemetrySummary(events: unknown): TelemetrySummary | undefined {
  if (!Array.isArray(events) || events.length === 0) {
    return undefined;
  }

  const counts = new Map<string, number>();
  let firstTimestamp: string | undefined;
  let lastTimestamp: string | undefined;

  for (const rawEvent of events) {
    if (!rawEvent || typeof rawEvent !== 'object') {
      continue;
    }

    const event = rawEvent as Record<string, unknown>;
    const type = typeof event._T === 'string' ? event._T : 'Unknown';
    const timestamp = typeof event._D === 'string' ? event._D : undefined;
    counts.set(type, (counts.get(type) ?? 0) + 1);

    if (timestamp && (!firstTimestamp || timestamp < firstTimestamp)) {
      firstTimestamp = timestamp;
    }
    if (timestamp && (!lastTimestamp || timestamp > lastTimestamp)) {
      lastTimestamp = timestamp;
    }
  }

  const topEventTypes = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([type, count]) => ({ type, count }));

  return {
    totalEvents: events.length,
    eventTypeCount: counts.size,
    killsLogged: (counts.get('LogPlayerKillV2') ?? 0) + (counts.get('LogPlayerKill') ?? 0),
    knockdownsLogged: counts.get('LogPlayerMakeGroggy') ?? 0,
    carePackageSpawns: counts.get('LogCarePackageSpawn') ?? 0,
    phaseChanges: counts.get('LogPhaseChange') ?? 0,
    bluezoneWarnings: counts.get('LogMatchDefinition') ?? 0,
    firstTimestamp,
    lastTimestamp,
    topEventTypes,
  };
}

async function fetchTelemetrySummary(telemetryUrl?: string) {
  if (!telemetryUrl) return undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(telemetryUrl, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
      next: {
        revalidate: 300,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return undefined;
    }

    const events = (await response.json()) as unknown;
    return buildTelemetrySummary(events);
  } catch {
    return undefined;
  }
}

export async function getPlayerOverview(playerName: string, shard: PlatformShard = DEFAULT_PLATFORM): Promise<PlayerOverview> {
  const currentSeasonId = await getCurrentSeasonId(shard);
  const rankedSeasonId = currentSeasonId;

  const playerLookup = await pubgFetch<PlayerLookupResponse>(
    `/shards/${shard}/players?filter[playerNames]=${sanitizePlayerName(playerName)}`,
  );

  const player = playerLookup.data[0];

  if (!player) {
    throw new Error(`Player "${playerName}" was not found on shard ${shard}.`);
  }

  const accountId = player.id;

  const [seasonStats, lifetimeStats, rankedStats, survival, weaponMastery] = await Promise.all([
    pubgFetch<SeasonStatsResponse>(`/shards/${shard}/players/${accountId}/seasons/${currentSeasonId}`),
    pubgFetch<SeasonStatsResponse>(`/shards/${shard}/players/${accountId}/seasons/lifetime`),
    pubgFetch<SeasonStatsResponse>(`/shards/${shard}/players/${accountId}/seasons/${rankedSeasonId}/ranked`).catch(() => null),
    pubgFetch<SurvivalResponse>(`/shards/${shard}/players/${accountId}/survival_mastery`).catch(() => null),
    pubgFetch<WeaponResponse>(`/shards/${shard}/players/${accountId}/weapon_mastery`).catch(() => null),
  ]);

  const gameModes = Object.fromEntries(
    Object.entries(seasonStats.data.attributes.gameModeStats ?? {}).map(([mode, stats]) => [
      mode,
      normalizeModeStats(stats),
    ]),
  );

  const rankedGameModes = Object.fromEntries(
    Object.entries(rankedStats?.data.attributes.gameModeStats ?? {}).map(([mode, stats]) => [
      mode,
      normalizeModeStats(stats),
    ]),
  );

  const lifeTime = Object.fromEntries(
    Object.entries(lifetimeStats.data.attributes.gameModeStats ?? {}).map(([mode, stats]) => [
      mode,
      normalizeModeStats(stats),
    ]),
  );

  const weaponMasteryTop = weaponMastery
    ? Object.entries(weaponMastery.data.attributes.weaponSummaries)
        .map(([weapon, stats]) => ({
          weapon,
          level: stats.WeaponMasteryLevel,
          xpTotal: stats.StatsTotal?.XPTotal ?? 0,
        }))
        .sort((a, b) => b.xpTotal - a.xpTotal)
        .slice(0, 5)
    : [];

  return {
    name: player.attributes.name,
    accountId,
    shard,
    seasonId: currentSeasonId,
    rankedSeasonId,
    platformLabel: PLATFORM_LABELS[shard],
    lastUpdated: new Date().toISOString(),
    gameModes,
    rankedGameModes,
    lifeTime,
    survival: survival
      ? {
          level: survival.data.attributes.stats.level,
          xp: survival.data.attributes.stats.xp,
          totalMatchesPlayed: survival.data.attributes.stats.totalMatchesPlayed,
        }
      : undefined,
    weaponMasteryTop,
    recentMatches:
      player.relationships?.matches?.data?.slice(0, 12).map((match) => ({
        id: match.id,
        shard,
      })) ?? [],
    summary: buildSummary(gameModes),
  };
}

export async function comparePlayers(names: string[], shard: PlatformShard = DEFAULT_PLATFORM) {
  const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))].slice(0, 4);

  const results = await Promise.allSettled(uniqueNames.map((name) => getPlayerOverview(name, shard)));

  const players: PlayerOverview[] = [];
  const failed: Array<{ name: string; reason: string }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      players.push(result.value);
    } else {
      failed.push({
        name: uniqueNames[index],
        reason: result.reason instanceof Error ? result.reason.message : 'Unknown error',
      });
    }
  });

  return { players, failed };
}

export async function getMatchOverview(matchId: string, shard: PlatformShard = DEFAULT_PLATFORM): Promise<MatchOverview> {
  const response = await pubgFetch<MatchResponse>(`/shards/${shard}/matches/${matchId}`, false);

  const included = response.included ?? [];
  const participants = included
    .filter((item) => item.type === 'participant')
    .map((item) => {
      const stats = (item.attributes?.stats as Record<string, unknown> | undefined) ?? {};

      return {
        accountId: String(stats.playerId ?? item.id),
        name: String(stats.name ?? 'Unknown'),
        teamId: nullableNumber(stats.teamId),
        winPlace: nullableNumber(stats.winPlace),
        kills: numberOrZero(stats.kills),
        assists: numberOrZero(stats.assists),
        damageDealt: numberOrZero(stats.damageDealt),
        headshotKills: numberOrZero(stats.headshotKills),
        timeSurvived: numberOrZero(stats.timeSurvived),
        longestKill: numberOrZero(stats.longestKill),
        rideDistance: numberOrZero(stats.rideDistance),
        walkDistance: numberOrZero(stats.walkDistance),
        revives: numberOrZero(stats.revives),
        dbnos: numberOrZero(stats.DBNOs),
      } satisfies MatchParticipantSummary;
    })
    .sort((a, b) => {
      const placementDiff = (a.winPlace ?? 999) - (b.winPlace ?? 999);
      if (placementDiff !== 0) return placementDiff;
      return b.kills - a.kills;
    });

  const telemetryUrl = included.find((item) => item.type === 'asset')?.attributes?.URL;
  const telemetrySummary = await fetchTelemetrySummary(typeof telemetryUrl === 'string' ? telemetryUrl : undefined);

  return {
    id: response.data.id,
    mapName: response.data.attributes.mapName,
    gameMode: response.data.attributes.gameMode,
    matchType: response.data.attributes.matchType,
    duration: response.data.attributes.duration,
    createdAt: response.data.attributes.createdAt,
    shardId: response.data.attributes.shardId,
    rosterCount: response.data.relationships?.rosters?.data?.length ?? 0,
    participantCount: response.data.relationships?.participants?.data?.length ?? participants.length,
    telemetryUrl: typeof telemetryUrl === 'string' ? telemetryUrl : undefined,
    telemetrySummary,
    participants,
  };
}
