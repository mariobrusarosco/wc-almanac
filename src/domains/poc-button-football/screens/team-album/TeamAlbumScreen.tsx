import { useEffect, useState, type CSSProperties } from "react";
import { getWorldCupTeam } from "../../api/client";
import type { WorldCupTeamResponse } from "../../api/types";
import { EditionSwitcher, TeamSwitcher } from "../../components/navigation-switchers/NavigationSwitchers";
import { getPlayerCountByPosition, getPositionFilterCode, PlayerPositionSwitcher } from "../../components/player-position-switcher/PlayerPositionSwitcher";
import { GoalkeeperPiece, PlayerButton, ReserveSlot } from "../../components/player-pieces/PlayerPieces";
import type {
  RouteParams,
  Player,
  PlayerPositionFilter,
  PositionCode,
  TeamColorProfile,
} from "../../types";
import "../../styles/base.css";
import "../../components/pitch-board/PitchBoard.css";
import "./TeamAlbumScreen.css";

type TeamAlbumScreenProps = RouteParams & {
  selectedPosition?: PlayerPositionFilter;
};

type TeamAlbumRequestState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: WorldCupTeamResponse;
    }
  | {
      status: "error";
      message: string;
    };

function TeamAlbumScreen({ year, teamCode, selectedPosition }: TeamAlbumScreenProps) {
  const route = {
    year,
    teamCode: teamCode.toUpperCase(),
  };
  const [requestState, setRequestState] = useState<TeamAlbumRequestState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    setRequestState({ status: "loading" });

    getWorldCupTeam(route)
      .then((data) => {
        if (!isCancelled) {
          setRequestState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setRequestState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fetch team data",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [route.year, route.teamCode]);

  if (requestState.status === "loading") {
    return <ScreenState eyebrow="Loading" title="Fetching Team" />;
  }

  if (requestState.status === "error") {
    return <NotFound message={requestState.message} route={route} />;
  }

  const { edition, team, editionOptions, teams: teamOptions } = requestState.data;
  const starters = sortPlayers(team.players.filter((player) => player.isStarter));
  const substitutes = sortPlayers(team.players.filter((player) => !player.isStarter));
  const goalkeeper = starters.find((player) => player.positionCode === "GK");
  const starterRows = buildStarterRows(starters);
  const selectedPositionCode = getPositionFilterCode(selectedPosition);

  return (
    <main className="page-shell" style={getTeamColorStyle(team.colors)}>
      <section className="album-header">
        <div>
          <p className="eyebrow">World Cup {edition.year}</p>
          <h1>{team.teamName}</h1>
        </div>
      </section>

      <EditionSwitcher
        currentYear={edition.year}
        editions={editionOptions}
        selectedPosition={selectedPosition}
        teamCode={team.teamCode}
        teamName={team.teamName}
      />

      <TeamSwitcher
        currentTeamCode={team.teamCode}
        selectedPosition={selectedPosition}
        teams={teamOptions}
        year={edition.year}
      />

      <section className="album-section" aria-labelledby="main-eleven-heading">
        <div className="pitch-board" aria-label={`${team.teamName} ${edition.year} main 11 on a half field`}>
          <div className="outfield-pyramid">
            {goalkeeper ? (
              <GoalkeeperPiece
                isDimmed={isPlayerDimmed(goalkeeper, selectedPositionCode)}
                player={goalkeeper}
                teamCode={team.teamCode}
              />
            ) : null}
            {starterRows.map((row) => (
              <div className="formation-row" key={row.label} aria-label={row.label}>
                {row.players.map((player) => (
                  <PlayerButton
                    isDimmed={isPlayerDimmed(player, selectedPositionCode)}
                    key={player.id}
                    player={player}
                    teamCode={team.teamCode}
                  />
                ))}
              </div>
            ))}
          </div>

          <PlayerPositionSwitcher
            playerCount={starters.length}
            playerCountByPosition={getPlayerCountByPosition(starters)}
            selectedPosition={selectedPosition}
            teamCode={team.teamCode}
            year={edition.year}
          />
        </div>
      </section>

      <section className="album-section" aria-labelledby="substitutes-heading">
        <div className="section-heading">
          <p className="eyebrow">Squad Depth</p>
          <h2 id="substitutes-heading">Substitutes</h2>
        </div>
        <div className="bench-box">
          {substitutes.map((player) => (
            <ReserveSlot
              isDimmed={isPlayerDimmed(player, selectedPositionCode)}
              key={player.id}
              player={player}
              teamCode={team.teamCode}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ScreenState({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <main className="page-shell">
      <section className="album-header album-screen-state">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </section>
    </main>
  );
}

function NotFound({ message, route }: { message?: string; route: RouteParams }) {
  return (
    <main className="page-shell">
      <section className="album-header">
        <div>
          <p className="eyebrow">Route not found</p>
          <h1>No Team</h1>
          {message ? <p className="album-error-message">{message}</p> : null}
        </div>
        <dl className="team-summary" aria-label="Requested route">
          <div>
            <dt>Year</dt>
            <dd>{route.year}</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>{route.teamCode}</dd>
          </div>
          <div>
            <dt>Try</dt>
            <dd>v0/2022/bra</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

function sortPlayers(players: Player[]) {
  return [...players].sort((a, b) => {
    const positionOrder = getPositionOrder(a.positionCode) - getPositionOrder(b.positionCode);
    if (positionOrder !== 0) return positionOrder;
    return (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999);
  });
}

function buildStarterRows(starters: Player[]) {
  const outfieldStarters = starters.filter((player) => player.positionCode !== "GK");

  return [
    {
      label: "Defense line",
      players: outfieldStarters.filter((player) => player.positionCode === "DF"),
    },
    {
      label: "Midfield line",
      players: outfieldStarters.filter((player) => player.positionCode === "MF"),
    },
    {
      label: "Attack line",
      players: outfieldStarters.filter((player) => player.positionCode === "FW"),
    },
  ];
}

function isPlayerDimmed(player: Player, selectedPositionCode?: PositionCode) {
  return Boolean(selectedPositionCode && player.positionCode !== selectedPositionCode);
}

function getTeamColorStyle(colors: TeamColorProfile) {
  return {
    "--team-button-face": colors.buttonFace,
    "--team-button-face-dark": colors.buttonFaceDark,
    "--team-button-side": colors.buttonSide,
    "--team-button-mark": colors.buttonMark,
    "--team-button-number": colors.buttonNumber,
    "--team-goalkeeper-base": colors.goalkeeperBase,
    "--team-goalkeeper-mark": colors.goalkeeperMark,
    "--team-accent": colors.accent,
    "--team-accent-text": colors.accentText,
  } as CSSProperties;
}

function getPositionOrder(position: PositionCode) {
  return {
    GK: 0,
    DF: 1,
    MF: 2,
    FW: 3,
  }[position];
}

export default TeamAlbumScreen;
