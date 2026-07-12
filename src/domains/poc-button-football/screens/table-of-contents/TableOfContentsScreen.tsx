import { Link } from "@tanstack/react-router";
import { almanacPages } from "../../almanac/page-index";
import cupImage from "../../assets/cup.png";
import "../../styles/base.css";
import "./TableOfContentsScreen.css";

const contents = [
  {
    label: "About the tournament",
    page: almanacPages.aboutTournament.page,
  },
  {
    label: "Editions",
    page: almanacPages.editions.page,
    to: "/v0/editions",
  },
  {
    label: "Squads",
    page: almanacPages.squads.page,
    to: "/v0/squads",
  },
];

function TableOfContentsScreen() {
  return (
    <main className="toc-shell">
      <section className="toc-page" aria-labelledby="toc-heading">
        <div className="toc-spine" aria-hidden="true" />
        <img className="toc-cup" src={cupImage} alt="" aria-hidden="true" />

        <header className="toc-title-box">
          <h1 id="toc-heading">Table of Contents</h1>
        </header>

        <ol className="toc-list" aria-label="World Cup Almanac sections">
          {contents.map((item) => (
            <li className="toc-list-item" key={item.label}>
              {item.to ? (
                <Link className="toc-list-link" to={item.to}>
                  <span className="toc-list-label">{item.label}</span>
                  <span className="toc-list-line" aria-hidden="true" />
                  <span className="toc-list-page">{item.page}</span>
                </Link>
              ) : (
                <>
                  <span className="toc-list-label">{item.label}</span>
                  <span className="toc-list-line" aria-hidden="true" />
                  <span className="toc-list-page">{item.page}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default TableOfContentsScreen;
