import { Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { getTeamOverview } from "../../api/client";
import type { TeamOverviewResponse } from "../../api/types";
import "../../styles/base.css";
import "./TeamOverviewScreen.css";

type TeamOverviewScreenProps = {
  teamCode: string;
};

type TeamOverviewRequestState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: TeamOverviewResponse;
    }
  | {
      status: "error";
      message: string;
    };

function TeamOverviewScreen({ teamCode }: TeamOverviewScreenProps) {
  const normalizedTeamCode = teamCode.toUpperCase();
  const [requestState, setRequestState] = useState<TeamOverviewRequestState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    setRequestState({ status: "loading" });

    getTeamOverview({ teamCode: normalizedTeamCode })
      .then((data) => {
        if (!isCancelled) {
          setRequestState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setRequestState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fetch team overview",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [normalizedTeamCode]);

  if (requestState.status === "loading") {
    return <TeamOverviewState eyebrow="Loading" title="Fetching Team" />;
  }

  if (requestState.status === "error") {
    return (
      <TeamOverviewState
        eyebrow="Team not found"
        message={requestState.message}
        title={normalizedTeamCode}
      />
    );
  }

  const { allTimeStats, nextTeam, previousTeam, team } = requestState.data;

  return (
    <main className="team-overview-shell" style={getTeamOverviewStyle(requestState.data)}>
      <section className="team-overview-page" aria-labelledby="team-overview-heading">
        <aside className="team-overview-spine" aria-hidden="true">
          <img className="team-overview-spine-badge" src={team.badgeAssetPath} alt="" />
        </aside>

        <nav className="team-overview-nav" aria-label={`${team.teamName} team navigation`}>
          {previousTeam ? (
            <Link
              className="team-overview-nav-link team-overview-nav-prev"
              to="/v0/squads/$teamCode"
              params={{ teamCode: previousTeam.teamCode }}
            >
              <span aria-hidden="true">←</span>
              <span>{previousTeam.teamCode}</span>
            </Link>
          ) : <span />}
          {nextTeam ? (
            <Link
              className="team-overview-nav-link team-overview-nav-next"
              to="/v0/squads/$teamCode"
              params={{ teamCode: nextTeam.teamCode }}
            >
              <span>{nextTeam.teamCode}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : <span />}
        </nav>

        <div className="team-overview-content">
          <header className="team-overview-header">
            <div className="team-overview-title-lockup">
              <h1 id="team-overview-heading">{team.teamName}</h1>
              <img className="team-overview-badge" src={team.badgeAssetPath} alt="" aria-hidden="true" />
            </div>

            <div className="team-overview-mode" aria-label="All time World Cups">
              <span>All Time</span>
              <i aria-hidden="true" />
              <strong>World Cups</strong>
            </div>
          </header>

          <dl className="team-overview-stat-grid" aria-label={`${team.teamName} all-time World Cup stats`}>
            <StatBlock label="Appearances" value={allTimeStats.appearances} />
            <div className="team-overview-stat team-overview-title-stat">
              <dt>Titles</dt>
              <dd>
                {allTimeStats.titleYears.length > 0 ? (
                  <ol className="team-overview-title-years" aria-label="Title years">
                    {allTimeStats.titleYears.map((year) => (
                      <li key={year}>{year}</li>
                    ))}
                  </ol>
                ) : (
                  <span>-</span>
                )}
              </dd>
            </div>
            <StatBlock label="Goals" value={allTimeStats.goals} />
            <StatBlock label="Wins" value={allTimeStats.wins} />
            <StatBlock label="Draw" value={allTimeStats.draws} />
            <StatBlock label="Loses" value={allTimeStats.losses} />
            <StatBlock label="Top Scorer" value={formatPersonName(allTimeStats.topScorer)} />
            <StatBlock label="Most Assists" value={formatPersonName(allTimeStats.mostAssists)} />
          </dl>
        </div>
      </section>
    </main>
  );
}

function TeamOverviewState({
  eyebrow,
  message,
  title,
}: {
  eyebrow: string;
  message?: string;
  title: string;
}) {
  return (
    <main className="team-overview-shell">
      <section className="team-overview-page team-overview-state">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        {message ? <span>{message}</span> : null}
      </section>
    </main>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="team-overview-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatPersonName(
  person:
    | {
        familyName: string;
        givenName: string | null;
      }
    | null
) {
  return person?.familyName ? person.familyName.toUpperCase() : "-";
}

function getTeamOverviewStyle(data: TeamOverviewResponse) {
  const { visualIdentity } = data.team;

  return {
    "--team-overview-accent": visualIdentity.accent,
    "--team-overview-accent-text": visualIdentity.accentText,
    "--team-overview-spine-color": visualIdentity.spineColor,
    "--team-overview-page-background": visualIdentity.pageBackground,
    "--team-overview-surface-color": visualIdentity.surfaceColor,
  } as CSSProperties;
}

export default TeamOverviewScreen;
