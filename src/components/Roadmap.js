import { Link } from "react-router-dom";

import alchemy from "../assets/alchemy.png";
import arcade from "../assets/arcade.png";
import den from "../assets/den.png";
import inkpen from "../assets/inkpen.png";
import land from "../assets/land.png";
import laptop from "../assets/laptop.png";
import museum from "../assets/museum.png";
import presents from "../assets/presents.png";
import raffle from "../assets/raffle.png";
import rocket from "../assets/rocket.png";

import "./Roadmap.css";

const Roadmap = () => {
  return (
    <>
      <div className="roadmap-container">
        <div className="roadmap-tooltip-item">
          <img
            src={presents}
            alt="Presents"
            className="greyed-out"
            id="presents"
          />
          <span className="roadmap-tooltip presents-tooltip">
            Holders' utility
          </span>
        </div>
        <div className="roadmap-tooltip-item">
          <Link to="/">
            <img src={den} className="greyed-out" alt="den" id="den" />
          </Link>
          <span className="roadmap-tooltip den-tooltip">The Den</span>
        </div>
        <img
          className="roadmap-img greyed-out"
          src={museum}
          alt="Museum"
          id="museum"
        />
        <img src={arcade} alt="Arcade" className="greyed-out" id="arcade" />

        <div className="roadmap-tooltip-item">
          <a href="https://www.moonrunners.io/lore/season-1">
            <img src={inkpen} alt="Inkpen" className="greyed-out" id="inkpen" />
          </a>
          <span className="roadmap-tooltip inkpen-tooltip">Lore</span>
        </div>

        <img src={rocket} alt="Rocket" className="greyed-out" id="rocket" />
        <div className="roadmap-tooltip-item">
          <Link to="/raffles">
            <img
              src={raffle}
              className="greyed-out selectable"
              alt="Raffle"
              id="raffle"
            />
          </Link>
          <span className="roadmap-tooltip raffle-tooltip">Raffles</span>
        </div>
        <img src={alchemy} alt="Alchemy" className="greyed-out" id="alchemy" />
        <img src={land} alt="Land" className="greyed-out" id="land" />
        <div className="roadmap-tooltip-item">
          <a
            href="https://soundcloud.com/brandynmusic/sets/moonrunners"
            target="_blank"
            rel="noreferrer"
          >
            <img src={laptop} alt="Laptop" className="greyed-out" id="laptop" />
          </a>
          <span className="roadmap-tooltip laptop-tooltip">Soundcloud</span>
        </div>
      </div>
    </>
  );
};

export default Roadmap;
