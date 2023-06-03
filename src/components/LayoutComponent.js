import secretsBg from "../assets/secrets-bg.png";
import raffleBg from "../assets/raffle-bg.png";

import { useLocation } from "react-router-dom";

import "./LayoutComponent.css";
import Navbar from "./Navbar";

const backgroundImages = {
  "/": `url(${secretsBg})`,
  "/staking": `url(${secretsBg})`,
  "/primordia": `url(${secretsBg})`,
  "/raffles": `url(${raffleBg})`,
  "/faq": `url(${secretsBg})`,
  "/admin": `url(${secretsBg})`,
};

const BackgroundComponent = (props) => {
  const location = useLocation();
  return (
    <div
      className="layout-container"
      style={{ backgroundImage: backgroundImages[location.pathname] }}
    >
      <Navbar />
      {props.children}
    </div>
  );
};

export default BackgroundComponent;
