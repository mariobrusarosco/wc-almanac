import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSquadPageByTeamCode } from "../../almanac/page-index";
import { getSquadsIndex } from "../../api/client";
import type { SquadsIndexResponse } from "../../api/types";
import cupImage from "../../assets/cup.png";
import "../../styles/base.css";
import "./SquadsScreen.css";

type SquadsRequestState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: SquadsIndexResponse;
    }
  | {
      status: "error";
      message: string;
    };

function SquadsScreen() {
  const [requestState, setRequestState] = useState<SquadsRequestState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    getSquadsIndex()
      .then((data) => {
        if (!isCancelled) {
          setRequestState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setRequestState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fetch squads",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const squadsWithPages = requestState.status === "success"
    ? requestState.data.squads
        .flatMap((squad) => {
          const page = getSquadPageByTeamCode(squad.teamCode);

          return typeof page === "number" ? [{ ...squad, page }] : [];
        })
        .sort((a, b) => a.page - b.page)
    : [];

  return (
    <main className="squads-shell">
      <section className="squads-page" aria-labelledby="squads-heading">
        <div className="squads-spine" aria-hidden="true" />
        <img className="squads-cup" src={cupImage} alt="" aria-hidden="true" />

        <div className="squads-content">
          <h1 id="squads-heading" className="squads-title">Squads</h1>

          {requestState.status === "loading" ? (
            <SquadsState label="Loading" value="Fetching Squads" />
          ) : null}

          {requestState.status === "error" ? (
            <SquadsState label="Unable to Load" value={requestState.message} />
          ) : null}

          {requestState.status === "success" ? (
            <ol className="squads-list" aria-label="National squads">
              {squadsWithPages.map((squad) => (
                <li className="squads-list-item" key={squad.teamId}>
                  <Link
                    className="squads-list-link"
                    to="/v0/squads/$teamCode"
                    params={{
                      teamCode: squad.teamCode,
                    }}
                  >
                    <img className="squad-badge" src={squad.badgeAssetPath} alt="" aria-hidden="true" />
                    <span className="squad-name">{squad.teamName}</span>
                    <span className="squad-code">{squad.teamCode}</span>
                    <span className="squad-line" aria-hidden="true" />
                    <span className="squad-page">{squad.page}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function SquadsState({ label, value }: { label: string; value: string }) {
  return (
    <div className="squads-state">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default SquadsScreen;
