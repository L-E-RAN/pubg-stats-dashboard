export type PlatformShard = 'psn' | 'xbox' | 'steam';

export type PlayerModeStats = {
  wins: number;
  top10s: number;
  kills: number;
  assists: number;
  dBNOs: number;
  roundsPlayed: number;
  damageDealt: number;
  headshotKills: number;
  longestKill: number;
  revives: number;
  timeSurvived: number;
  losses: number;
  killDeathRatio: number;
};

export type PlayerOverview = {
  name: string;
  accountId: string;
  shard: PlatformShard;
  seasonId: string;
  rankedSeasonId: string;
  platformLabel: string;
  lastUpdated: string;
  gameModes: Record<string, PlayerModeStats>;
  rankedGameModes: Record<string, PlayerModeStats>;
  lifeTime?: Record<string, PlayerModeStats>;
  survival?: {
    level: number;
    xp: number;
    totalMatchesPlayed: number;
  };
  weaponMasteryTop: Array<{
    weapon: string;
    level: number;
    xpTotal: number;
  }>;
  recentMatches: Array<{
    id: string;
    shard: PlatformShard;
    createdAt?: string;
  }>;
  summary: {
    totalWins: number;
    totalKills: number;
    avgDamage: number;
    kd: number;
    bestMode: string;
  };
};

export type CompareResponse = {
  players: PlayerOverview[];
  failed: Array<{
    name: string;
    reason: string;
  }>;
};

export type MatchParticipantSummary = {
  accountId: string;
  name: string;
  teamId: number | null;
  winPlace: number | null;
  kills: number;
  assists: number;
  damageDealt: number;
  headshotKills: number;
  timeSurvived: number;
  longestKill: number;
  rideDistance: number;
  walkDistance: number;
  revives: number;
  dbnos: number;
};

export type TelemetrySummary = {
  totalEvents: number;
  eventTypeCount: number;
  killsLogged: number;
  knockdownsLogged: number;
  carePackageSpawns: number;
  phaseChanges: number;
  bluezoneWarnings: number;
  firstTimestamp?: string;
  lastTimestamp?: string;
  topEventTypes: Array<{ type: string; count: number }>;
};

export type MatchOverview = {
  id: string;
  mapName: string;
  gameMode: string;
  matchType: string;
  duration: number;
  createdAt: string;
  shardId: string;
  rosterCount: number;
  participantCount: number;
  telemetryUrl?: string;
  telemetrySummary?: TelemetrySummary;
  participants: MatchParticipantSummary[];
};
