import { Link } from "@tanstack/react-router";
import cupImage from "../../assets/cup.png";
import "../../styles/base.css";
import "./PocHomeScreen.css";

function PocHomeScreen() {
  return (
    <main className="poc-home-shell">
      <section className="poc-home-poster" aria-labelledby="poc-home-title">
        <div className="poc-home-spine" aria-hidden="true" />

        <div className="poc-home-meta">
          <span>Editions</span>
          <span className="poc-home-meta-line" aria-hidden="true" />
          <span>1950-2022</span>
        </div>

        <Link
          className="poc-home-open"
          to="/v0/contents"
        >
          Open
        </Link>

        <div className="poc-home-title-block">
          <h1 id="poc-home-title">
            <span>World Cup</span>
            <span>Almanac</span>
          </h1>
        </div>

        <img className="poc-home-cup" src={cupImage} alt="" aria-hidden="true" />
      </section>
    </main>
  );
}

export default PocHomeScreen;
