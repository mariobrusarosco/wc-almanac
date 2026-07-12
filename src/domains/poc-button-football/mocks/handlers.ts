import { http, HttpResponse } from "msw";
import {
  getMockEditionsIndex,
  getMockSquadsIndex,
  getMockTeamOverview,
  getMockWorldCupEdition,
  getMockWorldCupTeam,
} from "./data";

export const handlers = [
  http.get("/api/editions", () => HttpResponse.json(getMockEditionsIndex())),

  http.get("/api/squads", () => HttpResponse.json(getMockSquadsIndex())),

  http.get("/api/teams/:teamCode", ({ params }) => {
    const teamCode = String(params.teamCode);
    const team = getMockTeamOverview({ teamCode });

    if (!team) {
      return HttpResponse.json(
        {
          message: "Team not found",
        },
        {
          status: 404,
        }
      );
    }

    return HttpResponse.json(team);
  }),

  http.get("/api/world-cups/:year", ({ params }) => {
    const year = Number(params.year);
    const edition = getMockWorldCupEdition({ year });

    if (!edition) {
      return HttpResponse.json(
        {
          message: "World Cup edition not found",
        },
        {
          status: 404,
        }
      );
    }

    return HttpResponse.json(edition);
  }),

  http.get("/api/world-cups/:year/teams/:teamCode", ({ params }) => {
    const year = Number(params.year);
    const teamCode = String(params.teamCode);
    const team = getMockWorldCupTeam({ year, teamCode });

    if (!team) {
      return HttpResponse.json(
        {
          message: "World Cup team not found",
        },
        {
          status: 404,
        }
      );
    }

    return HttpResponse.json(team);
  }),
];
