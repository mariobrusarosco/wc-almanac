import type {
  EditionsIndexResponse,
  GetTeamOverviewParams,
  GetWorldCupEditionParams,
  GetWorldCupTeamParams,
  SquadsIndexResponse,
  TeamOverviewResponse,
  WorldCupEditionResponse,
  WorldCupTeamResponse,
} from "./types";

const apiBaseUrl = "/api";

export async function getEditionsIndex(): Promise<EditionsIndexResponse> {
  return fetchJson<EditionsIndexResponse>(`${apiBaseUrl}/editions`);
}

export async function getWorldCupTeam({
  year,
  teamCode,
}: GetWorldCupTeamParams): Promise<WorldCupTeamResponse> {
  return fetchJson<WorldCupTeamResponse>(
    `${apiBaseUrl}/world-cups/${year}/teams/${teamCode.toLowerCase()}`
  );
}

export async function getWorldCupEdition({
  year,
}: GetWorldCupEditionParams): Promise<WorldCupEditionResponse> {
  return fetchJson<WorldCupEditionResponse>(`${apiBaseUrl}/world-cups/${year}`);
}

export async function getTeamOverview({
  teamCode,
}: GetTeamOverviewParams): Promise<TeamOverviewResponse> {
  return fetchJson<TeamOverviewResponse>(`${apiBaseUrl}/teams/${teamCode.toLowerCase()}`);
}

export async function getSquadsIndex(): Promise<SquadsIndexResponse> {
  return fetchJson<SquadsIndexResponse>(`${apiBaseUrl}/squads`);
}

async function fetchJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}
