import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getEditionPageByYear } from "../../almanac/page-index";
import { getEditionsIndex } from "../../api/client";
import type { EditionsIndexResponse } from "../../api/types";
import cupImage from "../../assets/cup.png";
import "../../styles/base.css";
import "./EditionsScreen.css";

type EditionsSortDirection = "asc" | "desc";
type EditionsRequestState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: EditionsIndexResponse;
    }
  | {
      status: "error";
      message: string;
    };

function EditionsScreen() {
  const [requestState, setRequestState] = useState<EditionsRequestState>({ status: "loading" });
  const [sortDirection, setSortDirection] = useState<EditionsSortDirection>("asc");

  useEffect(() => {
    let isCancelled = false;

    getEditionsIndex()
      .then((data) => {
        if (!isCancelled) {
          setRequestState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setRequestState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to fetch editions",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const sortedEditions = useMemo(
    () =>
      requestState.status === "success"
        ? requestState.data.editions
            .flatMap((edition) => {
              const page = getEditionPageByYear(edition.year);

              return typeof page === "number" ? [{ ...edition, page }] : [];
            })
            .sort((a, b) => {
              return sortDirection === "asc" ? a.page - b.page : b.page - a.page;
            })
        : [],
    [requestState, sortDirection]
  );


  return (
    <main className="editions-shell">
      <section className="editions-page" aria-labelledby="editions-heading">
        <div className="editions-spine" aria-hidden="true" />
        <img className="editions-cup" src={cupImage} alt="" aria-hidden="true" />

        <div className="editions-content">
          <h1 id="editions-heading" className="editions-title">Editions</h1>

          <div className="editions-sort" aria-label="Sort editions" role="group">
            <button
              aria-pressed={sortDirection === "asc"}
              className="editions-sort-button"
              data-active={sortDirection === "asc"}
              onClick={() => setSortDirection("asc")}
              type="button"
            >
              ASC
            </button>
            <button
              aria-pressed={sortDirection === "desc"}
              className="editions-sort-button"
              data-active={sortDirection === "desc"}
              onClick={() => setSortDirection("desc")}
              type="button"
            >
              DESC
            </button>
          </div>

          {requestState.status === "loading" ? (
            <EditionsState label="Loading" value="Fetching Editions" />
          ) : null}

          {requestState.status === "error" ? (
            <EditionsState label="Unable to Load" value={requestState.message} />
          ) : null}

          {requestState.status === "success" ? (
            <ol className="editions-list" aria-label="World Cup editions">
              {sortedEditions.map((edition) => (
                <li className="editions-list-item" key={edition.tournamentId}>
                  <Link
                    className="editions-list-link"
                    to="/v0/editions/$year"
                    params={{
                      year: String(edition.year),
                    }}
                  >
                    <img className="edition-flag" src={edition.hostBadgeAssetPath} alt="" aria-hidden="true" />
                    <span className="edition-host">{edition.hostDisplayName}</span>
                    <span className="edition-year">{edition.year}</span>
                    <span className="edition-line" aria-hidden="true" />
                    <span className="edition-page">{edition.page}</span>
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

function EditionsState({ label, value }: { label: string; value: string }) {
  return (
    <div className="editions-state">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default EditionsScreen;
