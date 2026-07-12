/**
 * build-temp-db.mjs
 *
 * Reads the local World Cup CSV files from data/data-csv/ and compiles them
 * into table-shaped JSON under data/db/.
 *
 * Entities included (MVP):
 * 1. Tournaments
 * 2. Teams
 * 3. World Cup Teams
 * 4. Team Visual Identities
 * 5. World Cup Visual Identities
 * 6. World Cup Team Visual Identities
 * 7. Squads & Players
 * 8. Match Appearances & Goals
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INPUT_DIR = join(ROOT, "data", "data-csv");
const OUTPUT_DIR = join(ROOT, "data", "db");

const START_YEAR = 1950;
const TEAM_BADGE_ASSETS = {
  ARG: "/src/domains/poc-button-football/assets/team-ARG.svg",
  BRA: "/src/domains/poc-button-football/assets/team-BRA.svg",
  FRA: "/src/domains/poc-button-football/assets/team-FRA.svg",
  QAT: "/src/domains/poc-button-football/assets/team-QAT.svg",
  RUS: "/src/domains/poc-button-football/assets/team-RUS.svg",
};
const WORLD_CUP_VISUAL_IDENTITY_PRESETS = {
  DEFAULT: {
    accent: "#88bdcb",
    accentText: "#4d5054",
    spineColor: "#88bdcb",
    pageBackground: "#f6f6f4",
    surfaceColor: "#ffffff",
  },
  "2018": {
    accent: "#b31b45",
    accentText: "#ffffff",
    spineColor: "#b31b45",
    pageBackground: "#f6f6f4",
    surfaceColor: "#ffffff",
  },
  "2022": {
    accent: "#95183f",
    accentText: "#ffffff",
    spineColor: "#95183f",
    pageBackground: "#f6f6f4",
    surfaceColor: "#ffffff",
  },
};
const TEAM_VISUAL_IDENTITY_PRESETS = {
  DEFAULT: {
    buttonFace: "#2e7d50",
    buttonFaceDark: "#195638",
    buttonSide: "#0e3f29",
    buttonMark: "#f0c847",
    buttonNumber: "#f0c847",
    goalkeeperBase: "#f3f0df",
    goalkeeperMark: "#1f7a45",
    accent: "#1f7a45",
    accentText: "#fffdf5",
  },
  ARG: {
    buttonFace: "#75aadb",
    buttonFaceDark: "#3f86b5",
    buttonSide: "#24587e",
    buttonMark: "#fffdf5",
    buttonNumber: "#10243f",
    goalkeeperBase: "#fffdf5",
    goalkeeperMark: "#10243f",
    accent: "#75aadb",
    accentText: "#10243f",
  },
  BRA: {
    buttonFace: "#2e7d50",
    buttonFaceDark: "#195638",
    buttonSide: "#0e3f29",
    buttonMark: "#f0c847",
    buttonNumber: "#f0c847",
    goalkeeperBase: "#f3f0df",
    goalkeeperMark: "#1f7a45",
    accent: "#1f7a45",
    accentText: "#fffdf5",
  },
  DEU: {
    buttonFace: "#f4f1e8",
    buttonFaceDark: "#cfc6ad",
    buttonSide: "#3f3930",
    buttonMark: "#111111",
    buttonNumber: "#111111",
    goalkeeperBase: "#111111",
    goalkeeperMark: "#f4f1e8",
    accent: "#111111",
    accentText: "#fffdf5",
  },
  ENG: {
    buttonFace: "#f7f4ec",
    buttonFaceDark: "#d7d0bd",
    buttonSide: "#8f1f2d",
    buttonMark: "#b52b3a",
    buttonNumber: "#10231d",
    goalkeeperBase: "#f7f4ec",
    goalkeeperMark: "#b52b3a",
    accent: "#b52b3a",
    accentText: "#fffdf5",
  },
  FRA: {
    buttonFace: "#294b9b",
    buttonFaceDark: "#173066",
    buttonSide: "#111f48",
    buttonMark: "#fffdf5",
    buttonNumber: "#f5d05a",
    goalkeeperBase: "#fffdf5",
    goalkeeperMark: "#294b9b",
    accent: "#294b9b",
    accentText: "#fffdf5",
  },
  ITA: {
    buttonFace: "#2f63ad",
    buttonFaceDark: "#1e3f74",
    buttonSide: "#172f55",
    buttonMark: "#fffdf5",
    buttonNumber: "#fffdf5",
    goalkeeperBase: "#fffdf5",
    goalkeeperMark: "#2f63ad",
    accent: "#2f63ad",
    accentText: "#fffdf5",
  },
  URY: {
    buttonFace: "#86c7ee",
    buttonFaceDark: "#4e9bc9",
    buttonSide: "#2b668c",
    buttonMark: "#fffdf5",
    buttonNumber: "#10243f",
    goalkeeperBase: "#fffdf5",
    goalkeeperMark: "#10243f",
    accent: "#4e9bc9",
    accentText: "#10243f",
  },
};

function isTargetTournament(row) {
  return (
    parseInt(row.year) >= START_YEAR &&
    row.tournament_name.includes("FIFA Men's World Cup")
  );
}

// ---------------------------------------------------------------------------
// CSV Parser
// ---------------------------------------------------------------------------
function parseCSV(filepath) {
  const text = readFileSync(filepath, "utf-8");
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  const headers = splitCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function saveJSON(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`   💾 Saved → ${filepath.replace(ROOT + "/", "")}`);
}

function getTeamBadgeAssetPath(teamCode) {
  return TEAM_BADGE_ASSETS[teamCode] ?? `/src/domains/poc-button-football/assets/team-${teamCode}.svg`;
}

function getTeamVisualIdentityPreset(teamCode) {
  return TEAM_VISUAL_IDENTITY_PRESETS[teamCode] ?? TEAM_VISUAL_IDENTITY_PRESETS.DEFAULT;
}

function getWorldCupVisualIdentityPreset(year) {
  return WORLD_CUP_VISUAL_IDENTITY_PRESETS[String(year)] ?? WORLD_CUP_VISUAL_IDENTITY_PRESETS.DEFAULT;
}

function getWorldCupLogoAssetPath(year) {
  return `/src/domains/poc-button-football/assets/${year}-logo.png`;
}

function getWorldCupTrophyAssetPath(year) {
  return `/src/domains/poc-button-football/assets/${year}-trophy.png`;
}

function getWorldCupTeamId(tournamentId, teamId) {
  return `${tournamentId}:${teamId}`;
}

function getTeamTournamentKey(tournamentId, teamId) {
  return `${tournamentId}:${teamId}`;
}

function toInt(value, fallback = 0) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeGivenName(value) {
  return value && value !== "not applicable" ? value : null;
}

function normalizeShirtNumber(value) {
  const number = toInt(value, null);
  return number && number > 0 ? number : null;
}

function buildWorldCupTeams({
  qualifiedTeamsRaw,
  tournamentStandingsRaw,
  teamAppearancesRaw,
  tournamentIds,
}) {
  const officialPositionByTeam = {};
  for (const row of tournamentStandingsRaw) {
    if (!tournamentIds.has(row.tournament_id)) continue;
    officialPositionByTeam[getTeamTournamentKey(row.tournament_id, row.team_id)] =
      toInt(row.position, null);
  }

  const appearancesByTeam = {};
  for (const row of teamAppearancesRaw) {
    if (!tournamentIds.has(row.tournament_id)) continue;
    const key = getTeamTournamentKey(row.tournament_id, row.team_id);
    if (!appearancesByTeam[key]) appearancesByTeam[key] = [];
    appearancesByTeam[key].push(row);
  }

  const worldCupTeams = qualifiedTeamsRaw
    .filter((row) => tournamentIds.has(row.tournament_id))
    .map((row) => {
      const key = getTeamTournamentKey(row.tournament_id, row.team_id);
      const appearances = appearancesByTeam[key] ?? [];
      const stats = buildTeamTournamentStats(appearances, row.count_matches);
      const officialFinalPosition = officialPositionByTeam[key] ?? null;

      return {
        id: getWorldCupTeamId(row.tournament_id, row.team_id),
        worldCupId: row.tournament_id,
        teamId: row.team_id,
        teamName: row.team_name,
        teamCode: row.team_code,
        stats,
        finish: {
          finalPosition: officialFinalPosition,
          officialFinalPosition,
          finalPositionSource: officialFinalPosition ? "official_raw" : null,
          finalStage: row.performance || null,
          finalMatch: buildFinalMatch(appearances),
        },
      };
    });

  assignDerivedFinalPositions(worldCupTeams);

  return worldCupTeams.sort((a, b) => {
    if (a.worldCupId !== b.worldCupId) return a.worldCupId.localeCompare(b.worldCupId);
    return a.finish.finalPosition - b.finish.finalPosition;
  });
}

function buildWorldCupTeamVisualIdentities({ worldCupTeams }) {
  return worldCupTeams.map((row) => ({
    id: `${row.id}:visual-identity`,
    worldCupTeamId: row.id,
    ...getTeamVisualIdentityPreset(row.teamCode),
  }));
}

function buildTeamVisualIdentities({ teams }) {
  return teams.map((row) => {
    const preset = getTeamVisualIdentityPreset(row.code);

    return {
      id: `${row.id}:visual-identity`,
      teamId: row.id,
      badgeAssetPath: getTeamBadgeAssetPath(row.code),
      accent: preset.accent,
      accentText: preset.accentText,
      spineColor: preset.buttonNumber,
      pageBackground: "#f7f4ec",
      surfaceColor: "#ffffff",
    };
  });
}

function buildWorldCupVisualIdentities({ tournaments }) {
  return tournaments.map((row) => ({
    id: `${row.id}:visual-identity`,
    worldCupId: row.id,
    logoAssetPath: getWorldCupLogoAssetPath(row.year),
    trophyAssetPath: getWorldCupTrophyAssetPath(row.year),
    ...getWorldCupVisualIdentityPreset(row.year),
  }));
}

function buildPlayers({ playersRaw, squadsRaw, tournamentIds }) {
  const participatingPlayerIds = new Set(
    squadsRaw
      .filter((row) => tournamentIds.has(row.tournament_id))
      .map((row) => row.player_id)
  );

  return playersRaw
    .filter((row) => participatingPlayerIds.has(row.player_id))
    .filter((row) => row.female !== "1")
    .map((row) => ({
      id: row.player_id,
      familyName: row.family_name,
      givenName: normalizeGivenName(row.given_name),
      birthDate: row.birth_date !== "not applicable" ? row.birth_date : null,
      positionFlags: {
        goalkeeper: row.goal_keeper === "1",
        defender: row.defender === "1",
        midfielder: row.midfielder === "1",
        forward: row.forward === "1",
      },
      countTournaments: toInt(row.count_tournaments),
      wikipediaUrl: row.player_wikipedia_link !== "not applicable" ? row.player_wikipedia_link : null,
    }))
    .sort((a, b) => a.familyName.localeCompare(b.familyName) || a.id.localeCompare(b.id));
}

function buildWorldCupSquads({ squadsRaw, tournamentIds }) {
  return squadsRaw
    .filter((row) => tournamentIds.has(row.tournament_id))
    .map((row) => ({
      id: `${row.tournament_id}:${row.team_id}:${row.player_id}`,
      worldCupId: row.tournament_id,
      teamId: row.team_id,
      playerId: row.player_id,
      familyName: row.family_name,
      givenName: normalizeGivenName(row.given_name),
      shirtNumber: normalizeShirtNumber(row.shirt_number),
      positionName: row.position_name,
      positionCode: row.position_code,
    }))
    .sort((a, b) => {
      if (a.worldCupId !== b.worldCupId) return a.worldCupId.localeCompare(b.worldCupId);
      if (a.teamId !== b.teamId) return a.teamId.localeCompare(b.teamId);
      return (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999);
    });
}

function buildGoals({ goalsRaw, tournamentIds }) {
  return goalsRaw
    .filter((row) => tournamentIds.has(row.tournament_id))
    .map((row) => ({
      id: row.goal_id,
      worldCupId: row.tournament_id,
      matchId: row.match_id,
      matchName: row.match_name,
      matchDate: row.match_date,
      stage: row.stage_name,
      groupName: row.group_name,
      teamId: row.team_id,
      teamName: row.team_name,
      teamCode: row.team_code,
      playerId: row.player_id,
      playerTeamId: row.player_team_id,
      playerTeamName: row.player_team_name,
      playerTeamCode: row.player_team_code,
      familyName: row.family_name,
      givenName: normalizeGivenName(row.given_name),
      shirtNumber: normalizeShirtNumber(row.shirt_number),
      minuteLabel: row.minute_label,
      minuteRegulation: toInt(row.minute_regulation),
      minuteStoppage: toInt(row.minute_stoppage),
      matchPeriod: row.match_period,
      ownGoal: row.own_goal === "1",
      penalty: row.penalty === "1",
    }))
    .sort((a, b) => {
      if (a.worldCupId !== b.worldCupId) return a.worldCupId.localeCompare(b.worldCupId);
      if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId);
      return a.id.localeCompare(b.id);
    });
}

function buildPlayerAppearances({ appearancesRaw, goalsByPlayerMatch, tournamentIds }) {
  return appearancesRaw
    .filter((row) => tournamentIds.has(row.tournament_id))
    .map((row) => ({
      id: `${row.match_id}:${row.team_id}:${row.player_id}`,
      worldCupId: row.tournament_id,
      matchId: row.match_id,
      matchName: row.match_name,
      matchDate: row.match_date,
      stage: row.stage_name,
      groupName: row.group_name,
      teamId: row.team_id,
      teamName: row.team_name,
      teamCode: row.team_code,
      homeTeam: row.home_team === "1",
      awayTeam: row.away_team === "1",
      playerId: row.player_id,
      familyName: row.family_name,
      givenName: normalizeGivenName(row.given_name),
      shirtNumber: normalizeShirtNumber(row.shirt_number),
      positionName: row.position_name,
      positionCode: row.position_code,
      started: row.starter === "1",
      substitute: row.substitute === "1",
      goalsScored: goalsByPlayerMatch[`${row.player_id}:${row.match_id}`] ?? 0,
    }))
    .sort((a, b) => {
      if (a.worldCupId !== b.worldCupId) return a.worldCupId.localeCompare(b.worldCupId);
      if (a.matchDate !== b.matchDate) return a.matchDate.localeCompare(b.matchDate);
      if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId);
      return a.playerId.localeCompare(b.playerId);
    });
}

function buildTeamTournamentStats(appearances, fallbackMatchCount) {
  return {
    matchesPlayed: toInt(fallbackMatchCount, appearances.length),
    wins: sumRows(appearances, "win"),
    draws: sumRows(appearances, "draw"),
    losses: sumRows(appearances, "lose"),
    goalsFor: sumRows(appearances, "goals_for"),
    goalsAgainst: sumRows(appearances, "goals_against"),
    goalDifference: sumRows(appearances, "goal_differential"),
    points: sumRows(appearances, "win") * 3 + sumRows(appearances, "draw"),
  };
}

function buildFinalMatch(appearances) {
  const finalAppearance = [...appearances].sort(compareAppearanceRows).at(-1);
  if (!finalAppearance) return null;

  return {
    matchId: finalAppearance.match_id,
    matchName: finalAppearance.match_name,
    matchDate: finalAppearance.match_date,
    stage: finalAppearance.stage_name,
    opponentId: finalAppearance.opponent_id,
    opponentName: finalAppearance.opponent_name,
    opponentCode: finalAppearance.opponent_code,
    result: finalAppearance.result,
    goalsFor: toInt(finalAppearance.goals_for),
    goalsAgainst: toInt(finalAppearance.goals_against),
    goalDifference: toInt(finalAppearance.goal_differential),
    extraTime: finalAppearance.extra_time === "1",
    penaltyShootout: finalAppearance.penalty_shootout === "1",
    penaltiesFor: toInt(finalAppearance.penalties_for),
    penaltiesAgainst: toInt(finalAppearance.penalties_against),
  };
}

function assignDerivedFinalPositions(worldCupTeams) {
  const teamsByWorldCup = {};
  for (const row of worldCupTeams) {
    if (!teamsByWorldCup[row.worldCupId]) teamsByWorldCup[row.worldCupId] = [];
    teamsByWorldCup[row.worldCupId].push(row);
  }

  for (const teams of Object.values(teamsByWorldCup)) {
    const orderedTeams = [...teams].sort(compareWorldCupTeamFinish);
    orderedTeams.forEach((team, index) => {
      if (team.finish.officialFinalPosition) return;

      team.finish.finalPosition = index + 1;
      team.finish.finalPositionSource = "derived_stage_stats";
    });
  }
}

function compareWorldCupTeamFinish(a, b) {
  if (a.finish.officialFinalPosition && b.finish.officialFinalPosition) {
    return a.finish.officialFinalPosition - b.finish.officialFinalPosition;
  }

  if (a.finish.officialFinalPosition) return -1;
  if (b.finish.officialFinalPosition) return 1;

  const stageRank = getStageRank(b.finish.finalStage) - getStageRank(a.finish.finalStage);
  if (stageRank !== 0) return stageRank;

  const points = b.stats.points - a.stats.points;
  if (points !== 0) return points;

  const goalDifference = b.stats.goalDifference - a.stats.goalDifference;
  if (goalDifference !== 0) return goalDifference;

  const goalsFor = b.stats.goalsFor - a.stats.goalsFor;
  if (goalsFor !== 0) return goalsFor;

  const wins = b.stats.wins - a.stats.wins;
  if (wins !== 0) return wins;

  const goalsAgainst = a.stats.goalsAgainst - b.stats.goalsAgainst;
  if (goalsAgainst !== 0) return goalsAgainst;

  return a.teamName.localeCompare(b.teamName);
}

function getStageRank(stage) {
  return {
    final: 80,
    "third-place match": 70,
    "semi-finals": 60,
    "quarter-finals": 50,
    "round of 16": 40,
    "second group stage": 30,
    "final round": 30,
    "group stage": 10,
    "first round": 10,
  }[stage] ?? 0;
}

function compareAppearanceRows(a, b) {
  const dateCompare = a.match_date.localeCompare(b.match_date);
  if (dateCompare !== 0) return dateCompare;

  return getMatchSortNumber(a.match_id) - getMatchSortNumber(b.match_id);
}

function getMatchSortNumber(matchId) {
  const match = matchId.match(/-(\d+)$/);
  return match ? toInt(match[1]) : 0;
}

function sumRows(rows, field) {
  return rows.reduce((sum, row) => sum + toInt(row[field]), 0);
}

// ---------------------------------------------------------------------------
// Main Builder
// ---------------------------------------------------------------------------
function build() {
  console.log("\n⚽️ Building World Cup Temp DB...\n");

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Read all required CSVs
  console.log("   Reading CSVs...");
  const tournamentsRaw = parseCSV(join(INPUT_DIR, "tournaments.csv"));
  const teamsRaw = parseCSV(join(INPUT_DIR, "teams.csv"));
  const playersRaw = parseCSV(join(INPUT_DIR, "players.csv"));
  const squadsRaw = parseCSV(join(INPUT_DIR, "squads.csv"));
  const appearancesRaw = parseCSV(join(INPUT_DIR, "player_appearances.csv"));
  const goalsRaw = parseCSV(join(INPUT_DIR, "goals.csv"));
  const qualifiedTeamsRaw = parseCSV(join(INPUT_DIR, "qualified_teams.csv"));
  const teamAppearancesRaw = parseCSV(join(INPUT_DIR, "team_appearances.csv"));
  const tournamentStandingsRaw = parseCSV(join(INPUT_DIR, "tournament_standings.csv"));

  // 2. Filter & Transform Tournaments
  const tournaments = tournamentsRaw
    .filter(isTargetTournament)
    .map((r) => ({
      id: r.tournament_id,
      year: parseInt(r.year),
      name: r.tournament_name,
      hostCountry: r.host_country,
      winner: r.winner,
      startDate: r.start_date,
      endDate: r.end_date,
      teamCount: parseInt(r.count_teams),
    }))
    .sort((a, b) => a.year - b.year);

  const tournamentIds = new Set(tournaments.map((t) => t.id));

  // 3. Transform Teams
  const participatingTeamIds = new Set(
    squadsRaw
      .filter((r) => tournamentIds.has(r.tournament_id))
      .map((r) => r.team_id)
  );

  const teams = teamsRaw
    .filter((t) => participatingTeamIds.has(t.team_id))
    .map((r) => ({
      id: r.team_id,
      name: r.team_name,
      code: r.team_code,
      confederation: r.confederation_code,
      confederationName: r.confederation_name,
      region: r.region_name,
    }));

  saveJSON(join(OUTPUT_DIR, "tournaments.json"), tournaments);

  const worldCupVisualIdentities = buildWorldCupVisualIdentities({ tournaments });
  saveJSON(join(OUTPUT_DIR, "world_cup_visual_identities.json"), worldCupVisualIdentities);

  saveJSON(join(OUTPUT_DIR, "teams.json"), teams);

  const teamVisualIdentities = buildTeamVisualIdentities({ teams });
  saveJSON(join(OUTPUT_DIR, "team_visual_identities.json"), teamVisualIdentities);

  const worldCupTeams = buildWorldCupTeams({
    qualifiedTeamsRaw,
    tournamentStandingsRaw,
    teamAppearancesRaw,
    tournamentIds,
  });
  saveJSON(join(OUTPUT_DIR, "world_cup_teams.json"), worldCupTeams);

  const worldCupTeamVisualIdentities = buildWorldCupTeamVisualIdentities({ worldCupTeams });
  saveJSON(join(OUTPUT_DIR, "world_cup_team_visual_identities.json"), worldCupTeamVisualIdentities);

  const players = buildPlayers({ playersRaw, squadsRaw, tournamentIds });
  saveJSON(join(OUTPUT_DIR, "players.json"), players);

  const worldCupSquads = buildWorldCupSquads({ squadsRaw, tournamentIds });
  saveJSON(join(OUTPUT_DIR, "world_cup_squads.json"), worldCupSquads);

  const goals = buildGoals({ goalsRaw, tournamentIds });
  saveJSON(join(OUTPUT_DIR, "goals.json"), goals);

  const goalsByPlayerMatch = {};
  for (const row of goals) {
    if (row.ownGoal) continue;
    const key = `${row.playerId}:${row.matchId}`;
    goalsByPlayerMatch[key] = (goalsByPlayerMatch[key] ?? 0) + 1;
  }

  const playerAppearances = buildPlayerAppearances({
    appearancesRaw,
    goalsByPlayerMatch,
    tournamentIds,
  });
  saveJSON(join(OUTPUT_DIR, "player_appearances.json"), playerAppearances);

  console.log("\n✅ DB Generation Complete!");
  console.log(`   📁 Located in: data/db/`);
}

build();
