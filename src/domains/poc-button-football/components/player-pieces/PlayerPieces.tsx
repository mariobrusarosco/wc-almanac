import type { Player } from "../../types";
import "./PlayerPieces.css";

export function GoalkeeperPiece({ isDimmed, player, teamCode }: { isDimmed: boolean; player: Player; teamCode: string }) {
  const fullName = formatName(player);

  return (
    <article className={isDimmed ? "goalkeeper-piece player-dimmed" : "goalkeeper-piece"}>
      <div className="goalkeeper-badge" aria-hidden="true">
        {teamCode}
      </div>
      <span className="goalkeeper-number">{player.shirtNumber ?? "-"}</span>
      <div>
        <h3>{fullName}</h3>
        <p>{player.positionCode}</p>
      </div>
      <PlayerStats player={player} />
    </article>
  );
}

export function PlayerButton({ isDimmed, player, teamCode }: { isDimmed: boolean; player: Player; teamCode: string }) {
  const fullName = formatName(player);

  return (
    <article className={isDimmed ? "button-player player-dimmed" : "button-player"}>
      <div className={`button-disc button-${player.positionCode.toLowerCase()}`}>
        <span className="button-badge">{teamCode}</span>
        <span className="button-number">{player.shirtNumber ?? "-"}</span>
      </div>
      <div className="button-label">
        <h3>{fullName}</h3>
        <p>{player.positionCode}</p>
      </div>
      <PlayerStats player={player} />
    </article>
  );
}

export function ReserveSlot({ isDimmed, player, teamCode }: { isDimmed: boolean; player: Player; teamCode: string }) {
  const fullName = formatName(player);

  return (
    <article className={isDimmed ? "reserve-slot player-dimmed" : "reserve-slot"}>
      <div className={`reserve-disc button-${player.positionCode.toLowerCase()}`}>
        <span className="button-badge">{teamCode}</span>
        <span className="button-number">{player.shirtNumber ?? "-"}</span>
      </div>
      <div className="reserve-copy">
        <h3>{fullName}</h3>
        <p>{player.positionCode}</p>
      </div>
      <PlayerStats player={player} compact />
    </article>
  );
}

function PlayerStats({ player, compact = false }: { player: Player; compact?: boolean }) {
  return (
    <dl className={compact ? "stat-row stat-row-compact" : "stat-row"} aria-label={`${formatName(player)} tournament statistics`}>
      <div>
        <dt>Apps</dt>
        <dd>{player.stats.matchesPlayed}</dd>
      </div>
      <div>
        <dt>Starts</dt>
        <dd>{player.stats.starts}</dd>
      </div>
      <div>
        <dt>Goals</dt>
        <dd>{player.stats.totalGoals}</dd>
      </div>
    </dl>
  );
}

function formatName(player: Player) {
  return [player.givenName, player.familyName].filter(Boolean).join(" ");
}
