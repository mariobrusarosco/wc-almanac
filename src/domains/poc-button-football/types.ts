export type PositionCode = "GK" | "DF" | "MF" | "FW";

export type PlayerPositionFilter = "goalkeeper" | "defense" | "midfield" | "attack";

export type TeamColorProfile = {
  buttonFace: string;
  buttonFaceDark: string;
  buttonSide: string;
  buttonMark: string;
  buttonNumber: string;
  goalkeeperBase: string;
  goalkeeperMark: string;
  accent: string;
  accentText: string;
};

export type TeamVisualIdentity = {
  badgeAssetPath: string;
  accent: string;
  accentText: string;
  spineColor: string;
  pageBackground: string;
  surfaceColor: string;
};

export type Player = {
  id: string;
  familyName: string;
  givenName: string | null;
  shirtNumber: number | null;
  position: string;
  positionCode: PositionCode;
  isStarter: boolean;
  stats: {
    matchesPlayed: number;
    starts: number;
    subbedOn: number;
    totalGoals: number;
  };
  appearances: Array<{
    matchId: string;
    matchName: string;
    matchDate: string;
    stage: string;
    started: boolean;
    substitute: boolean;
    goalsScored: number;
  }>;
};

export type Team = {
  worldCupTeamId?: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  badgeAssetPath: string;
  colors: TeamColorProfile;
  tournamentStats?: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
  finish?: {
    finalPosition: number;
    officialFinalPosition: number | null;
    finalPositionSource: string;
    finalStage: string;
    finalMatch: {
      matchId: string;
      matchName: string;
      matchDate: string;
      stage: string;
      opponentId: string;
      opponentName: string;
      opponentCode: string;
      result: string;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      extraTime: boolean;
      penaltyShootout: boolean;
      penaltiesFor: number;
      penaltiesAgainst: number;
    } | null;
  };
  players: Player[];
};

export type Edition = {
  tournamentId: string;
  year: number;
  teams: Team[];
};

export type RouteParams = {
  year: number;
  teamCode: string;
};
