import { useState } from "react";
import den from "../assets/den-animated.gif";
import stakingImage from "../assets/moonrunners-button.png";
import primordia from "../assets/primordia-button.png";
import primordiaYellow from "../assets/primordia-button-yellow.png";
import alchemy from "../assets/alchemy-button.png";
import land from "../assets/land-button.png";
import raffle from "../assets/raffle-button.png";
import raffleButtonYellow from "../assets/raffle-button-yellow.png"
import faqImage from "../assets/faq-button.png";
import moon from "../assets/moon.png";
import stakingImageYellow from "../assets/moonrunners-button-yellow.png";
import faqImageYellow from "../assets/faq-button-yellow.png";

import { Outlet, Link } from "react-router-dom";
import "./Navbar.css";

const staking = "staking";
const faq = "faq";

const Navbar = () => {
  const [hovered, setHovered] = useState("");

  return (
    <>
      <div className="container">
        <img src={den} className="den-logo" alt="Den" />
        <Link to="/roadmap">
          {" "}
          <img src={moon} className="moon-img" alt="moon" />{" "}
        </Link>
        <div id="moonrunnersNavbar" className="navbar-menu">
          <div className="navbar-start">
            <Link to="/staking">
              <img
                src={hovered === staking ? stakingImageYellow : stakingImage}
                className="nav-img"
                id="moonrunnersImage"
                onMouseEnter={() => setHovered('staking')}
                onMouseLeave={() => setHovered("")}
                alt="staking"
              />
            </Link>
            <Link to="/primordia">
              <img 
              src={hovered === 'primordia' ? primordiaYellow : primordia}
              className="nav-img " 
              alt="primordia" 
              onMouseEnter={() => setHovered('primordia')}
                onMouseLeave={() => setHovered("")}
              />
            </Link>
            <Link to="/raffles">
              <img 
              src={hovered === 'raffles' ? raffleButtonYellow : raffle}
              className="nav-img " 
              alt="raffles" 
              onMouseEnter={() => setHovered('raffles')}
                onMouseLeave={() => setHovered("")}
              />
            </Link>
            <Link to="/weaponBurn" style={{ pointerEvents: "none" }}>
              <img
                src={alchemy}
                className="nav-img img-grey"
                alt="Twitter"
              />
            </Link>
            <Link to="/raffles" style={{ pointerEvents: "none" }}>
              <img src={land} className="nav-img img-grey" alt="Twitter" />{" "}
            </Link>
            <Link to="/faq">
              <img
                src={hovered === faq ? faqImageYellow : faqImage}
                className="nav-img"
                alt="Twitter"
                onMouseEnter={() => setHovered(faq)}
                onMouseLeave={() => setHovered("")}
              />
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
