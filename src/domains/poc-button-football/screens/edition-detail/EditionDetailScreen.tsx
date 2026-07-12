import { Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { getWorldCupEdition } from "../../api/client";
import type { WorldCupEditionResponse } from "../../api/types";
import "../../styles/base.css";
import "./EditionDetailScreen.css";

type EditionDetailScreenProps = {
  year: number;
};

type EditionDetailRequestState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: WorldCupEditionResponse;
    }
  | {
      status: "error";
      message: string;
    };

const curatedPenaltyRowsByYear = {
  2022: {
    rows: [
      { home: "Messi", homeScored: true, away: "Mbappe", awayScored: true },
      { home: "Dybala", homeScored: true, away: "Coman", awayScored: false },
      { home: "Paredes", homeScored: true, away: "Tchouameni", awayScored: false },
      { home: "Montiel", homeScored: true, away: "Kolo Muani", awayScored: true },
    ],
  },
};

function EditionDetailScreen({ year }: EditionDetailScreenProps) {
  const [requestState, setRequestState] = useState<EditionDetailRequestState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    setRequestState({ status: "loading" });

    getWorldCupEdition({ year })
      .then((data) => {
        if (!isCancelled) {
          setRequestState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setRequestState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fetch edition data",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [year]);

  if (requestState.status === "loading") {
    return <EditionDetailState eyebrow="Loading" title="Fetching Edition" />;
  }

  if (requestState.status === "error") {
    return <EditionDetailState eyebrow="Edition not found" title={String(year)} message={requestState.message} />;
  }

  const { data } = requestState;
  const penaltyRows = curatedPenaltyRowsByYear[year as keyof typeof curatedPenaltyRowsByYear]?.rows ?? [];

  return (
    <main className="edition-detail-shell" style={getEditionVisualIdentityStyle(data.edition.visualIdentity)}>
      <section className="edition-detail-page" aria-labelledby="edition-detail-heading">
        <div className="edition-detail-spine" aria-hidden="true" />
        <img className="edition-detail-cup-crop" src={data.edition.logoAssetPath} alt="" aria-hidden="true" />

        <nav className="edition-detail-nav" aria-label={`${data.edition.hostDisplayName} ${year} edition navigation`}>
          {data.previousEdition ? (
            <Link
              className="edition-detail-nav-prev"
              to="/v0/editions/$year"
              params={{ year: String(data.previousEdition.year) }}
            >
              <span aria-hidden="true">←</span>
              <span>{data.previousEdition.hostLabel}</span>
              <span className="edition-detail-year-chip">{data.previousEdition.year}</span>
            </Link>
          ) : <span />}
          {data.nextEdition ? (
            <Link
              className="edition-detail-nav-next"
              to="/v0/editions/$year"
              params={{ year: String(data.nextEdition.year) }}
            >
              <span>{data.nextEdition.hostLabel}</span>
              <span className="edition-detail-year-chip">{data.nextEdition.year}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : <span />}
        </nav>

        <div className="edition-detail-grid">
          <section className="edition-detail-main" aria-label={`${data.edition.hostDisplayName} ${year} overview`}>
            <header className="edition-detail-header">
              <h1 id="edition-detail-heading" className="edition-detail-title">{data.edition.hostDisplayName}</h1>
              <span>{data.edition.year}</span>
            </header>

            {data.winner ? (
              <section className="edition-winner" aria-label={`${data.winner.teamName} finished first`}>
                <img className="edition-winner-cup" src={data.edition.trophyAssetPath} alt="" aria-hidden="true" />
                <div>
                  <p>{data.winner.placeLabel}</p>
                  <h2>
                    {data.winner.teamName}
                    <TeamFlag src={data.winner.badgeAssetPath} />
                  </h2>
                </div>
              </section>
            ) : null}

            {data.final ? (
              <section className="edition-final" aria-labelledby="edition-final-heading">
                <h2 id="edition-final-heading">{data.final.stageLabel}</h2>
                <div className="edition-final-scoreline">
                  <span>{data.final.homeTeamName}</span>
                  <TeamFlag src={data.final.homeTeamBadgeAssetPath} />
                  <strong>{data.final.homeScore}</strong>
                  <strong>{data.final.awayScore}</strong>
                  <TeamFlag src={data.final.awayTeamBadgeAssetPath} />
                  <span>{data.final.awayTeamName}</span>
                </div>

                {data.final.penalties ? (
                  <div className="edition-penalties" aria-label="Penalty shootout">
                    <p>Penalties</p>
                    <div className="edition-penalty-score">
                      <strong>{data.final.penalties.home}</strong>
                      <strong>{data.final.penalties.away}</strong>
                    </div>
                    {penaltyRows.length > 0 ? (
                      <div className="edition-penalty-list">
                        {penaltyRows.map((row) => (
                          <div className="edition-penalty-row" key={`${row.home}-${row.away}`}>
                            <span>{row.home}</span>
                            <span className={row.homeScored ? "penalty-dot penalty-dot-scored" : "penalty-dot penalty-dot-missed"} />
                            <span className={row.awayScored ? "penalty-dot penalty-dot-scored" : "penalty-dot penalty-dot-missed"} />
                            <span>{row.away}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : null}
          </section>

          <aside className="edition-detail-overview" aria-label="Edition section">
            <span>Overview</span>
          </aside>
        </div>
      </section>
    </main>
  );
}

function EditionDetailState({
  eyebrow,
  message,
  title,
}: {
  eyebrow: string;
  message?: string;
  title: string;
}) {
  return (
    <main className="edition-detail-shell">
      <section className="edition-detail-page edition-detail-state">
        <p>{eyebrow}</p>
        <h1 className="edition-detail-title">{title}</h1>
        {message ? <span>{message}</span> : null}
      </section>
    </main>
  );
}

function TeamFlag({ src }: { src: string }) {
  return <img className="edition-detail-flag" src={src} alt="" aria-hidden="true" />;
}

function getEditionVisualIdentityStyle(
  visualIdentity: WorldCupEditionResponse["edition"]["visualIdentity"]
) {
  return {
    "--edition-accent": visualIdentity.accent,
    "--edition-accent-text": visualIdentity.accentText,
    "--edition-spine-color": visualIdentity.spineColor,
    "--edition-page-background": visualIdentity.pageBackground,
    "--edition-surface-color": visualIdentity.surfaceColor,
  } as CSSProperties;
}

export default EditionDetailScreen;
