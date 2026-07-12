import teamsJson from "../data/db/teams.json";
import tournamentsJson from "../data/db/tournaments.json";
import worldCupTeamsJson from "../data/db/world_cup_teams.json";

type TournamentRow = {
  year: number;
};

type TeamRow = {
  id: string;
  code: string;
  name: string;
};

type WorldCupTeamRow = {
  teamId: string;
};

type AlmanacPageEntry = {
  page: number;
  to?: string;
};

type EditionPageEntry = AlmanacPageEntry & {
  year: number;
};

type SquadPageEntry = AlmanacPageEntry & {
  teamCode: string;
  teamName: string;
};

const STATIC_PAGES = {
  tableOfContents: 1,
  aboutTournament: 2,
  editions: 3,
};
const FIRST_EDITION_PAGE = 4;

const tournaments = tournamentsJson as TournamentRow[];
const teams = teamsJson as TeamRow[];
const worldCupTeams = worldCupTeamsJson as WorldCupTeamRow[];

const worldCupTeamIds = new Set(worldCupTeams.map((team) => team.teamId));
const orderedEditions = [...tournaments].sort((a, b) => a.year - b.year);
const orderedSquads = teams
  .filter((team) => worldCupTeamIds.has(team.id))
  .sort((a, b) => a.code.localeCompare(b.code));

const editionPageEntries: EditionPageEntry[] = orderedEditions.map((edition, index) => ({
  year: edition.year,
  page: FIRST_EDITION_PAGE + index,
  to: `/v0/editions/${edition.year}`,
}));
const firstSquadPage = FIRST_EDITION_PAGE + editionPageEntries.length;
const squadPageEntries: SquadPageEntry[] = orderedSquads.map((team, index) => ({
  teamCode: team.code,
  teamName: team.name,
  page: firstSquadPage + index,
  to: `/v0/squads/${team.code}`,
}));

const editionsByYear = Object.fromEntries(
  editionPageEntries.map((entry) => [entry.year, entry])
) as Record<number, EditionPageEntry>;
const squadsByTeamCode = Object.fromEntries(
  squadPageEntries.map((entry) => [entry.teamCode, entry])
) as Record<string, SquadPageEntry>;

export const almanacPages = {
  tableOfContents: {
    page: STATIC_PAGES.tableOfContents,
    to: "/v0/contents",
  },
  editions: {
    page: STATIC_PAGES.editions,
    to: "/v0/editions",
  },
  aboutTournament: {
    page: STATIC_PAGES.aboutTournament,
  },
  squads: {
    page: firstSquadPage,
    to: "/v0/squads",
  },
  editionsByYear,
  squadsByTeamCode,
};

export const almanacEditionPageEntries = editionPageEntries;
export const almanacSquadPageEntries = squadPageEntries;

export function getEditionPageByYear(year: number) {
  return editionsByYear[year]?.page;
}

export function getSquadPageByTeamCode(teamCode: string) {
  return squadsByTeamCode[teamCode.toUpperCase()]?.page;
}
