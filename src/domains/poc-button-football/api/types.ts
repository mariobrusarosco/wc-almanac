import type { Team, TeamVisualIdentity } from "../types";

export type EditionNavigationItem = {
  hostLabel: string;
  year: number;
};

export type WorldCupEditionResponse = {
  edition: {
    tournamentId: string;
    year: number;
    name: string;
    hostCountry: string;
    hostDisplayName: string;
    winner: string;
    startDate: string;
    endDate: string;
    teamCount: number;
    accent: string;
    accentText: string;
    logoAssetPath: string;
    trophyAssetPath: string;
    visualIdentity: {
      accent: string;
      accentText: string;
      spineColor: string;
      pageBackground: string;
      surfaceColor: string;
    };
  };
  previousEdition?: EditionNavigationItem;
  nextEdition?: EditionNavigationItem;
  winner?: {
    placeLabel: string;
    teamName: string;
    teamCode: string;
    badgeAssetPath: string;
  };
  final?: {
    stageLabel: string;
    homeTeamName: string;
    homeTeamCode: string;
    homeTeamBadgeAssetPath: string;
    homeScore: number;
    awayScore: number;
    awayTeamName: string;
    awayTeamCode: string;
    awayTeamBadgeAssetPath: string;
    penalties?: {
      home: number;
      away: number;
    };
  };
};

export type EditionsIndexResponse = {
  editions: Array<{
    tournamentId: string;
    year: number;
    hostCountry: string;
    hostDisplayName: string;
    hostTeamCode: string | null;
    hostBadgeAssetPath: string;
  }>;
};

export type WorldCupTeamResponse = {
  edition: {
    tournamentId: string;
    year: number;
  };
  team: Team;
  editionOptions: number[];
  teams: Array<{
    teamCode: string;
    teamName: string;
    badgeAssetPath: string;
  }>;
};

export type TeamNavigationItem = {
  teamCode: string;
  teamName: string;
  badgeAssetPath: string;
};

export type TeamGoalLeader = {
  playerId: string;
  familyName: string;
  givenName: string | null;
  goals: number;
};

export type TeamAssistLeader = {
  playerId: string;
  familyName: string;
  givenName: string | null;
  assists: number;
};

export type TeamOverviewResponse = {
  team: {
    teamId: string;
    teamName: string;
    teamCode: string;
    badgeAssetPath: string;
    visualIdentity: TeamVisualIdentity;
  };
  previousTeam?: TeamNavigationItem;
  nextTeam?: TeamNavigationItem;
  allTimeStats: {
    appearances: number;
    titleYears: number[];
    goals: number;
    wins: number;
    draws: number;
    losses: number;
    topScorer: TeamGoalLeader | null;
    mostAssists: TeamAssistLeader | null;
  };
};

export type SquadsIndexResponse = {
  squads: Array<{
    teamId: string;
    teamName: string;
    teamCode: string;
    badgeAssetPath: string;
    appearances: number;
  }>;
};

export type GetWorldCupTeamParams = {
  year: number;
  teamCode: string;
};

export type GetWorldCupEditionParams = {
  year: number;
};

export type GetTeamOverviewParams = {
  teamCode: string;
};
