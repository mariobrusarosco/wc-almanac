import type {
  EditionsIndexResponse,
  SquadsIndexResponse,
  TeamOverviewResponse,
  WorldCupEditionResponse,
  WorldCupTeamResponse,
} from "../api/types";
import goalsJson from "../data/db/goals.json";
import playerAppearancesJson from "../data/db/player_appearances.json";
import teamVisualIdentitiesJson from "../data/db/team_visual_identities.json";
import teamsJson from "../data/db/teams.json";
import tournamentsJson from "../data/db/tournaments.json";
import worldCupVisualIdentitiesJson from "../data/db/world_cup_visual_identities.json";
import worldCupSquadsJson from "../data/db/world_cup_squads.json";
import worldCupTeamVisualIdentitiesJson from "../data/db/world_cup_team_visual_identities.json";
import worldCupTeamsJson from "../data/db/world_cup_teams.json";
import type { Player, PositionCode, Team, TeamColorProfile, TeamVisualIdentity } from "../types";

type TournamentRow = {
  id: string;
  year: number;
  name: string;
  hostCountry: string;
  winner: string;
  startDate: string;
  endDate: string;
  teamCount: number;
};

type TeamRow = {
  id: string;
  name: string;
  code: string;
  confederation: string;
  confederationName: string;
  region: string;
};

type WorldCupVisualIdentityRow = {
  id: string;
  worldCupId: string;
  logoAssetPath: string;
  trophyAssetPath: string;
  accent: string;
  accentText: string;
  spineColor: string;
  pageBackground: string;
  surfaceColor: string;
};

type WorldCupTeamRow = {
  id: string;
  worldCupId: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  stats: NonNullable<Team["tournamentStats"]>;
  finish: {
    finalPosition: number;
    officialFinalPosition: number | null;
    finalPositionSource: string;
    finalStage: string;
    finalMatch: NonNullable<NonNullable<Team["finish"]>["finalMatch"]> | null;
  };
};

type WorldCupTeamVisualIdentityRow = TeamColorProfile & {
  id: string;
  worldCupTeamId: string;
};

type TeamVisualIdentityRow = TeamVisualIdentity & {
  id: string;
  teamId: string;
};

type WorldCupSquadRow = {
  id: string;
  worldCupId: string;
  teamId: string;
  playerId: string;
  familyName: string;
  givenName: string | null;
  shirtNumber: number | null;
  positionName: string;
  positionCode: string;
};

type PlayerAppearanceRow = {
  id: string;
  worldCupId: string;
  matchId: string;
  matchName: string;
  matchDate: string;
  stage: string;
  groupName: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  homeTeam: boolean;
  awayTeam: boolean;
  playerId: string;
  familyName: string;
  givenName: string | null;
  shirtNumber: number | null;
  positionName: string;
  positionCode: string;
  started: boolean;
  substitute: boolean;
  goalsScored: number;
};

type GoalRow = {
  id: string;
  worldCupId: string;
  playerId: string;
  playerTeamCode: string;
  familyName: string;
  givenName: string | null;
  ownGoal: boolean;
};

const tournaments = tournamentsJson as TournamentRow[];
const worldCupVisualIdentities = worldCupVisualIdentitiesJson as WorldCupVisualIdentityRow[];
const teams = teamsJson as TeamRow[];
const teamVisualIdentities = teamVisualIdentitiesJson as TeamVisualIdentityRow[];
const worldCupTeams = worldCupTeamsJson as WorldCupTeamRow[];
const worldCupTeamVisualIdentities =
  worldCupTeamVisualIdentitiesJson as WorldCupTeamVisualIdentityRow[];
const worldCupSquads = worldCupSquadsJson as WorldCupSquadRow[];
const playerAppearances = playerAppearancesJson as PlayerAppearanceRow[];
const goals = goalsJson as GoalRow[];

const tournamentsByYear = Object.fromEntries(
  tournaments.map((tournament) => [tournament.year, tournament])
) as Record<number, TournamentRow>;

const tournamentsById = Object.fromEntries(
  tournaments.map((tournament) => [tournament.id, tournament])
) as Record<string, TournamentRow>;

const teamsById = Object.fromEntries(teams.map((team) => [team.id, team])) as Record<string, TeamRow>;
const visualIdentitiesByTeamId = Object.fromEntries(
  teamVisualIdentities.map((visualIdentity) => [visualIdentity.teamId, visualIdentity])
) as Record<string, TeamVisualIdentityRow>;
const visualIdentitiesByWorldCupId = Object.fromEntries(
  worldCupVisualIdentities.map((visualIdentity) => [visualIdentity.worldCupId, visualIdentity])
) as Record<string, WorldCupVisualIdentityRow>;
const visualIdentitiesByWorldCupTeamId = Object.fromEntries(
  worldCupTeamVisualIdentities.map((visualIdentity) => [
    visualIdentity.worldCupTeamId,
    visualIdentity,
  ])
) as Record<string, WorldCupTeamVisualIdentityRow>;

const squadsByWorldCupTeam = groupRows(worldCupSquads, (row) => getWorldCupTeamKey(row.worldCupId, row.teamId));
const appearancesBySquadPlayer = groupRows(playerAppearances, (row) =>
  getSquadPlayerKey(row.worldCupId, row.teamId, row.playerId)
);

const editionDisplayOverrides: Record<number, Partial<WorldCupEditionResponse["edition"]>> = {
  2022: {
    hostDisplayName: "Catar",
  },
};

const nextEditionOverrides: Record<number, WorldCupEditionResponse["nextEdition"]> = {
  2022: {
    hostLabel: "USA - MEX - CAN",
    year: 2026,
  },
};

const hostLabelByCountry: Record<string, string> = {
  Brazil: "BRA",
  Switzerland: "SUI",
  Sweden: "SWE",
  Chile: "CHI",
  England: "ENG",
  Mexico: "MEX",
  Germany: "GER",
  "West Germany": "FRG",
  Argentina: "ARG",
  Spain: "ESP",
  Italy: "ITA",
  France: "FRA",
  "South Africa": "RSA",
  Russia: "RUS",
  Qatar: "QAT",
};

export function getMockEditionsIndex(): EditionsIndexResponse {
  return {
    editions: [...tournaments]
      .sort((a, b) => a.year - b.year)
      .map((tournament) => {
        const hostTeam = getHostTeam(tournament);

        return {
          tournamentId: tournament.id,
          year: tournament.year,
          hostCountry: tournament.hostCountry,
          hostDisplayName: tournament.hostCountry,
          hostTeamCode: hostTeam?.code ?? null,
          hostBadgeAssetPath: hostTeam
            ? getTeamVisualIdentity(hostTeam).badgeAssetPath
            : getFallbackBadgeAssetPath(getHostLabel(tournament.hostCountry)),
        };
      }),
  };
}

export function getMockWorldCupEdition({ year }: { year: number }): WorldCupEditionResponse | null {
  const tournament = tournamentsByYear[year];

  if (!tournament) {
    return null;
  }

  const tournamentVisualIdentity = getWorldCupVisualIdentity(tournament);
  const editionTeams = getWorldCupTeamsForTournament(tournament.id);
  const winner = editionTeams.find((team) => team.finish.finalPosition === 1);
  const runnerUp = editionTeams.find((team) => team.finish.finalPosition === 2);
  const winnerFinalMatch = winner?.finish.finalMatch;
  const finalOpponent = winnerFinalMatch
    ? editionTeams.find((team) => team.teamId === winnerFinalMatch.opponentId) ?? runnerUp
    : runnerUp;

  const final = winner && finalOpponent && winnerFinalMatch
    ? {
        stageLabel: "Final",
        homeTeamName: winner.teamName,
        homeTeamCode: winner.teamCode,
        homeTeamBadgeAssetPath: getTeamBadgeAssetPath(winner),
        homeScore: winnerFinalMatch.goalsFor,
        awayScore: winnerFinalMatch.goalsAgainst,
        awayTeamName: finalOpponent.teamName,
        awayTeamCode: finalOpponent.teamCode,
        awayTeamBadgeAssetPath: getTeamBadgeAssetPath(finalOpponent),
        penalties: winnerFinalMatch.penaltyShootout
          ? {
              home: winnerFinalMatch.penaltiesFor,
              away: winnerFinalMatch.penaltiesAgainst,
            }
          : undefined,
      }
    : undefined;

  return {
    edition: {
      tournamentId: tournament.id,
      year: tournament.year,
      name: tournament.name,
      hostCountry: tournament.hostCountry,
      hostDisplayName: tournament.hostCountry,
      winner: tournament.winner,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      teamCount: tournament.teamCount,
      accent: tournamentVisualIdentity.accent,
      accentText: tournamentVisualIdentity.accentText,
      logoAssetPath: tournamentVisualIdentity.logoAssetPath,
      trophyAssetPath: tournamentVisualIdentity.trophyAssetPath,
      visualIdentity: {
        accent: tournamentVisualIdentity.accent,
        accentText: tournamentVisualIdentity.accentText,
        spineColor: tournamentVisualIdentity.spineColor,
        pageBackground: tournamentVisualIdentity.pageBackground,
        surfaceColor: tournamentVisualIdentity.surfaceColor,
      },
      ...editionDisplayOverrides[year],
    },
    previousEdition: getPreviousEdition(tournament.year),
    nextEdition: nextEditionOverrides[year] ?? getNextEdition(tournament.year),
    winner: winner
      ? {
          placeLabel: "First place",
          teamName: winner.teamName,
          teamCode: winner.teamCode,
          badgeAssetPath: getTeamBadgeAssetPath(winner),
        }
      : undefined,
    final,
  };
}

export function getMockWorldCupTeam({
  year,
  teamCode,
}: {
  year: number;
  teamCode: string;
}): WorldCupTeamResponse | null {
  const tournament = tournamentsByYear[year];

  if (!tournament) {
    return null;
  }

  const worldCupTeam = getWorldCupTeamsForTournament(tournament.id).find(
    (item) => item.teamCode.toLowerCase() === teamCode.toLowerCase()
  );

  if (!worldCupTeam) {
    return null;
  }

  return {
    edition: {
      tournamentId: tournament.id,
      year: tournament.year,
    },
    team: buildTeamResponse(worldCupTeam),
    editionOptions: getTeamEditionOptions(worldCupTeam.teamCode),
    teams: getEditionTeamOptions(tournament.id),
  };
}

export function getMockTeamOverview({
  teamCode,
}: {
  teamCode: string;
}): TeamOverviewResponse | null {
  const baseTeam = teams.find((team) => team.code.toLowerCase() === teamCode.toLowerCase());

  if (!baseTeam) {
    return null;
  }

  const appearances = worldCupTeams
    .filter((worldCupTeam) => worldCupTeam.teamId === baseTeam.id)
    .sort((a, b) => getWorldCupTeamYear(a) - getWorldCupTeamYear(b));
  const teamVisualIdentity = getTeamVisualIdentity(baseTeam);

  return {
    team: {
      teamId: baseTeam.id,
      teamName: baseTeam.name,
      teamCode: baseTeam.code,
      badgeAssetPath: teamVisualIdentity.badgeAssetPath,
      visualIdentity: teamVisualIdentity,
    },
    ...getTeamNavigation(baseTeam),
    allTimeStats: {
      appearances: appearances.length,
      titleYears: appearances
        .filter((appearance) => appearance.finish.finalPosition === 1)
        .map((appearance) => getWorldCupTeamYear(appearance))
        .sort((a, b) => a - b),
      goals: appearances.reduce((sum, appearance) => sum + appearance.stats.goalsFor, 0),
      wins: appearances.reduce((sum, appearance) => sum + appearance.stats.wins, 0),
      draws: appearances.reduce((sum, appearance) => sum + appearance.stats.draws, 0),
      losses: appearances.reduce((sum, appearance) => sum + appearance.stats.losses, 0),
      topScorer: getTopScorer(baseTeam.code),
      mostAssists: null,
    },
  };
}

export function getMockSquadsIndex(): SquadsIndexResponse {
  return {
    squads: teams
      .map((team) => ({
        team,
        appearances: worldCupTeams.filter((worldCupTeam) => worldCupTeam.teamId === team.id).length,
      }))
      .filter(({ appearances }) => appearances > 0)
      .sort((a, b) => a.team.name.localeCompare(b.team.name))
      .map(({ appearances, team }) => ({
        teamId: team.id,
        teamName: team.name,
        teamCode: team.code,
        badgeAssetPath: getTeamVisualIdentity(team).badgeAssetPath,
        appearances,
      })),
  };
}

function buildTeamResponse(worldCupTeam: WorldCupTeamRow): Team {
  const baseTeam = teamsById[worldCupTeam.teamId];
  const squadRows = squadsByWorldCupTeam[getWorldCupTeamKey(worldCupTeam.worldCupId, worldCupTeam.teamId)] ?? [];
  const players = squadRows.map((row) => buildPlayerResponse(row));

  determineStarters(players);

  return {
    worldCupTeamId: worldCupTeam.id,
    teamId: worldCupTeam.teamId,
    teamName: baseTeam?.name ?? worldCupTeam.teamName,
    teamCode: baseTeam?.code ?? worldCupTeam.teamCode,
    badgeAssetPath: getTeamBadgeAssetPath(worldCupTeam),
    colors: getTeamColorProfile(worldCupTeam),
    tournamentStats: worldCupTeam.stats,
    finish: worldCupTeam.finish,
    players,
  };
}

function buildPlayerResponse(row: WorldCupSquadRow): Player {
  const appearances =
    appearancesBySquadPlayer[getSquadPlayerKey(row.worldCupId, row.teamId, row.playerId)] ?? [];

  return {
    id: row.playerId,
    familyName: row.familyName,
    givenName: row.givenName,
    shirtNumber: row.shirtNumber,
    position: row.positionName,
    positionCode: toPositionCode(row.positionCode),
    isStarter: false,
    stats: {
      matchesPlayed: appearances.length,
      starts: appearances.filter((appearance) => appearance.started).length,
      subbedOn: appearances.filter((appearance) => appearance.substitute).length,
      totalGoals: appearances.reduce((sum, appearance) => sum + appearance.goalsScored, 0),
    },
    appearances: appearances.map((appearance) => ({
      matchId: appearance.matchId,
      matchName: appearance.matchName,
      matchDate: appearance.matchDate,
      stage: appearance.stage,
      started: appearance.started,
      substitute: appearance.substitute,
      goalsScored: appearance.goalsScored,
    })),
  };
}

function determineStarters(players: Player[]) {
  const rankPlayers = (a: Player, b: Player) => {
    if (b.stats.starts !== a.stats.starts) return b.stats.starts - a.stats.starts;
    if (b.stats.matchesPlayed !== a.stats.matchesPlayed) return b.stats.matchesPlayed - a.stats.matchesPlayed;
    if (b.stats.totalGoals !== a.stats.totalGoals) return b.stats.totalGoals - a.stats.totalGoals;

    return (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999);
  };

  const goalkeepers = players.filter((player) => player.positionCode === "GK").sort(rankPlayers);
  const outfieldPlayers = players.filter((player) => player.positionCode !== "GK").sort(rankPlayers);

  if (goalkeepers[0]) {
    goalkeepers[0].isStarter = true;
  }

  for (const player of outfieldPlayers.slice(0, 10)) {
    player.isStarter = true;
  }
}

function getTeamEditionOptions(teamCode: string) {
  const years = worldCupTeams
    .filter((row) => row.teamCode.toLowerCase() === teamCode.toLowerCase())
    .map((row) => tournamentsById[row.worldCupId]?.year)
    .filter((year): year is number => typeof year === "number");

  return [...new Set(years)].sort((a, b) => b - a);
}

function getEditionTeamOptions(worldCupId: string) {
  return getWorldCupTeamsForTournament(worldCupId)
    .map((team) => ({
      teamCode: team.teamCode,
      teamName: team.teamName,
      badgeAssetPath: getTeamBadgeAssetPath(team),
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));
}

function getTeamNavigation(currentTeam: TeamRow) {
  const teamsWithWorldCupAppearances = teams
    .filter((team) => worldCupTeams.some((worldCupTeam) => worldCupTeam.teamId === team.id))
    .sort((a, b) => a.code.localeCompare(b.code));
  const currentIndex = teamsWithWorldCupAppearances.findIndex((team) => team.id === currentTeam.id);

  return {
    previousTeam: toTeamNavigationItem(teamsWithWorldCupAppearances[currentIndex - 1]),
    nextTeam: toTeamNavigationItem(teamsWithWorldCupAppearances[currentIndex + 1]),
  };
}

function toTeamNavigationItem(team?: TeamRow) {
  return team
    ? {
        teamCode: team.code,
        teamName: team.name,
        badgeAssetPath: getTeamVisualIdentity(team).badgeAssetPath,
      }
    : undefined;
}

function getTopScorer(teamCode: string) {
  const scoringTotals = goals
    .filter((goal) => goal.playerTeamCode.toLowerCase() === teamCode.toLowerCase() && !goal.ownGoal)
    .reduce<
      Record<
        string,
        {
          playerId: string;
          familyName: string;
          givenName: string | null;
          goals: number;
        }
      >
    >((totals, goal) => {
      const existing = totals[goal.playerId] ?? {
        playerId: goal.playerId,
        familyName: goal.familyName,
        givenName: goal.givenName,
        goals: 0,
      };

      totals[goal.playerId] = {
        ...existing,
        goals: existing.goals + 1,
      };

      return totals;
    }, {});

  return Object.values(scoringTotals).sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;

    return a.familyName.localeCompare(b.familyName);
  })[0] ?? null;
}

function getWorldCupTeamYear(worldCupTeam: WorldCupTeamRow) {
  return tournamentsById[worldCupTeam.worldCupId]?.year ?? 0;
}

function getWorldCupTeamsForTournament(worldCupId: string) {
  return worldCupTeams.filter((team) => team.worldCupId === worldCupId);
}

function getWorldCupVisualIdentity(tournament: TournamentRow) {
  return visualIdentitiesByWorldCupId[tournament.id] ?? {
    id: `${tournament.id}:visual-identity`,
    worldCupId: tournament.id,
    logoAssetPath: `/src/domains/poc-button-football/assets/${tournament.year}-logo.png`,
    trophyAssetPath: `/src/domains/poc-button-football/assets/${tournament.year}-trophy.png`,
    accent: "#88bdcb",
    accentText: "#4d5054",
    spineColor: "#88bdcb",
    pageBackground: "#f6f6f4",
    surfaceColor: "#ffffff",
  };
}

function getTeamBadgeAssetPath(worldCupTeam: WorldCupTeamRow) {
  const baseTeam = teamsById[worldCupTeam.teamId];

  return baseTeam
    ? getTeamVisualIdentity(baseTeam).badgeAssetPath
    : getFallbackBadgeAssetPath(worldCupTeam.teamCode);
}

function getFallbackBadgeAssetPath(teamCode: string) {
  return `https://placehold.co/100x100?text=${teamCode}`;
}

function getHostTeam(tournament: TournamentRow) {
  return teams.find(
    (team) => team.name.toLowerCase() === tournament.hostCountry.toLowerCase()
  );
}

function getHostLabel(hostCountry: string) {
  return hostLabelByCountry[hostCountry] ?? hostCountry.slice(0, 3).toUpperCase();
}

function getTeamVisualIdentity(team: TeamRow): TeamVisualIdentity {
  return visualIdentitiesByTeamId[team.id] ?? getFallbackTeamVisualIdentity(team);
}

function getFallbackTeamVisualIdentity(team: TeamRow): TeamVisualIdentity {
  return {
    badgeAssetPath: getFallbackBadgeAssetPath(team.code),
    accent: "#1f7a45",
    accentText: "#fffdf5",
    spineColor: "#f0c847",
    pageBackground: "#f7f4ec",
    surfaceColor: "#ffffff",
  };
}

function getTeamColorProfile(worldCupTeam: WorldCupTeamRow): TeamColorProfile {
  const visualIdentity = visualIdentitiesByWorldCupTeamId[worldCupTeam.id];

  return visualIdentity ? toTeamColorProfile(visualIdentity) : getFallbackTeamColorProfile();
}

function toTeamColorProfile(row: WorldCupTeamVisualIdentityRow): TeamColorProfile {
  return {
    buttonFace: row.buttonFace,
    buttonFaceDark: row.buttonFaceDark,
    buttonSide: row.buttonSide,
    buttonMark: row.buttonMark,
    buttonNumber: row.buttonNumber,
    goalkeeperBase: row.goalkeeperBase,
    goalkeeperMark: row.goalkeeperMark,
    accent: row.accent,
    accentText: row.accentText,
  };
}

function getFallbackTeamColorProfile(): TeamColorProfile {
  return {
    buttonFace: "#2e7d50",
    buttonFaceDark: "#195638",
    buttonSide: "#0e3f29",
    buttonMark: "#f0c847",
    buttonNumber: "#f0c847",
    goalkeeperBase: "#f3f0df",
    goalkeeperMark: "#1f7a45",
    accent: "#1f7a45",
    accentText: "#fffdf5",
  };
}

function getPreviousEdition(year: number) {
  const previous = [...tournaments].reverse().find((tournament) => tournament.year < year);

  return previous ? getEditionNavigationItem(previous) : undefined;
}

function getNextEdition(year: number) {
  const next = tournaments.find((tournament) => tournament.year > year);

  return next ? getEditionNavigationItem(next) : undefined;
}

function getEditionNavigationItem(tournament: TournamentRow) {
  return {
    hostLabel: hostLabelByCountry[tournament.hostCountry] ?? tournament.hostCountry,
    year: tournament.year,
  };
}

function getWorldCupTeamKey(worldCupId: string, teamId: string) {
  return `${worldCupId}:${teamId}`;
}

function getSquadPlayerKey(worldCupId: string, teamId: string, playerId: string) {
  return `${worldCupId}:${teamId}:${playerId}`;
}

function toPositionCode(positionCode: string): PositionCode {
  if (positionCode === "GK" || positionCode === "DF" || positionCode === "MF" || positionCode === "FW") {
    return positionCode;
  }

  return "MF";
}

function groupRows<TRow>(rows: TRow[], getKey: (row: TRow) => string) {
  return rows.reduce<Record<string, TRow[]>>((groups, row) => {
    const key = getKey(row);
    groups[key] = [...(groups[key] ?? []), row];
    return groups;
  }, {});
}
