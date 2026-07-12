import { Link } from "@tanstack/react-router";
import type { PlayerPositionFilter } from "../../types";
import "./NavigationSwitchers.css";

export function TeamSwitcher({
  currentTeamCode,
  selectedPosition,
  teams,
  year,
}: {
  currentTeamCode: string;
  selectedPosition?: PlayerPositionFilter;
  teams: Array<{ teamCode: string; teamName: string }>;
  year: number;
}) {
  return (
    <nav className="edition-switcher team-switcher" aria-label={`${year} national squads`}>
      <p className="edition-switcher-label">National Squads</p>
      <div className="edition-pill-row">
        {teams.map((team) => (
          <Link
            key={team.teamCode}
            to="/v0/$year/$teamCode"
            params={{
              year: String(year),
              teamCode: team.teamCode.toLowerCase(),
            }}
            search={getPositionSearch(selectedPosition)}
            className={
              team.teamCode === currentTeamCode
                ? "edition-pill edition-pill-active"
                : "edition-pill"
            }
            aria-current={team.teamCode === currentTeamCode ? "page" : undefined}
            title={team.teamName}
          >
            {team.teamCode}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function EditionSwitcher({
  currentYear,
  editions,
  selectedPosition,
  teamCode,
  teamName,
}: {
  currentYear: number;
  editions: number[];
  selectedPosition?: PlayerPositionFilter;
  teamCode: string;
  teamName: string;
}) {
  return (
    <nav className="edition-switcher" aria-label={`${teamName} World Cup editions`}>
      <p className="edition-switcher-label">World Cups</p>
      <div className="edition-pill-row">
        {editions.map((year) => (
          <Link
            key={year}
            to="/v0/$year/$teamCode"
            params={{
              year: String(year),
              teamCode: teamCode.toLowerCase(),
            }}
            search={getPositionSearch(selectedPosition)}
            className={year === currentYear ? "edition-pill edition-pill-active" : "edition-pill"}
            aria-current={year === currentYear ? "page" : undefined}
          >
            {year}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function getPositionSearch(position?: PlayerPositionFilter) {
  return position ? { position } : {};
}
