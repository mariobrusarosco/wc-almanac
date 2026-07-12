import { Link } from "@tanstack/react-router";
import type { Player, PlayerPositionFilter, PositionCode } from "../../types";
import "./PlayerPositionSwitcher.css";

const playerPositionOptions: Array<{
  value: PlayerPositionFilter;
  code: PositionCode;
  label: string;
  shortLabel: string;
}> = [
  { value: "goalkeeper", code: "GK", label: "Goalkeeper", shortLabel: "GK" },
  { value: "defense", code: "DF", label: "Defenders", shortLabel: "DF" },
  { value: "midfield", code: "MF", label: "Midfielders", shortLabel: "MF" },
  { value: "attack", code: "FW", label: "Forwards", shortLabel: "FW" },
];

export function PlayerPositionSwitcher({
  playerCount,
  playerCountByPosition,
  selectedPosition,
  teamCode,
  year,
}: {
  playerCount: number;
  playerCountByPosition: Record<PositionCode, number>;
  selectedPosition?: PlayerPositionFilter;
  teamCode: string;
  year: number;
}) {
  return (
    <nav className="position-switcher" aria-label="Filter players by position">
      <p className="position-switcher-label">Positions</p>
      <div className="position-option-list">
        <Link
          to="/v0/$year/$teamCode"
          params={{
            year: String(year),
            teamCode: teamCode.toLowerCase(),
          }}
          search={{}}
          className={!selectedPosition ? "position-option position-option-active" : "position-option"}
          aria-current={!selectedPosition ? "true" : undefined}
        >
          <span className="position-option-label">All</span>
          <span className="position-option-short" aria-hidden="true">All</span>
          <strong>{playerCount}</strong>
        </Link>
        {playerPositionOptions.map((option) => (
          <Link
            key={option.value}
            to="/v0/$year/$teamCode"
            params={{
              year: String(year),
              teamCode: teamCode.toLowerCase(),
            }}
            search={{
              position: option.value,
            }}
            className={
              selectedPosition === option.value
                ? "position-option position-option-active"
                : "position-option"
            }
            aria-current={selectedPosition === option.value ? "true" : undefined}
          >
            <span className="position-option-label">{option.label}</span>
            <span className="position-option-short" aria-hidden="true">{option.shortLabel}</span>
            <strong>{playerCountByPosition[option.code]}</strong>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function getPositionFilterCode(position?: PlayerPositionFilter) {
  return playerPositionOptions.find((option) => option.value === position)?.code;
}

export function getPlayerCountByPosition(players: Player[]) {
  return playerPositionOptions.reduce(
    (counts, option) => ({
      ...counts,
      [option.code]: players.filter((player) => player.positionCode === option.code).length,
    }),
    {
      GK: 0,
      DF: 0,
      MF: 0,
      FW: 0,
    } as Record<PositionCode, number>
  );
}
