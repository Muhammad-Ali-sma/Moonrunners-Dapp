import "./Trophies.css";

import clock from "../assets/Clock.gif";
import trophy1 from "../assets/trophy1.png";
import trophy2 from "../assets/trophy2.png";
import trophy3 from "../assets/trophy3.png";
import trophy4 from "../assets/trophy4.png";

import { useTrophies } from "../hooks/useTrophies";
import { useTokens } from "../hooks/useTokens";


const Trophies = () => {
  const { possibleTrophyClaim, claimTime } = useTrophies();
  const { stakedMoonrunners } = useTokens();

  console.log(claimTime)
  console.log(possibleTrophyClaim)
  return (
    <>
      <div className="columns is-centered is-vcentered trophy-time-text">
        <div className="column">
          <div>
            Pledged&nbsp;
            <strong className="trophies-strong">
              {stakedMoonrunners.length}
            </strong>
            &nbsp;moonrunners
          </div>
          <h1 className="trophy-text">
            &nbsp;
            <span>
              {stakedMoonrunners.length >= 25
                ? " Diamond Trophy"
                : stakedMoonrunners.length >= 10
                ? " Gold Trophy"
                : stakedMoonrunners.length >= 5
                ? " Silver Trophy"
                : stakedMoonrunners.length >= 1
                ? " Bronze Trophy"
                : "No trophy available "}
            </span>
            {stakedMoonrunners.length >= 1 && (
              <>
              &nbsp;
              <img
                className="trophy-claim-image"
                src={
                    stakedMoonrunners.length >= 25
                    ? trophy4
                    : stakedMoonrunners.length >= 10
                    ? trophy3
                    : stakedMoonrunners.length >= 5
                    ? trophy2
                    : stakedMoonrunners.length >= 1
                    ? trophy1
                    : null
                }
                alt="trophy"
              />
              </>
            )}
            {stakedMoonrunners.length > 0 && claimTime && <span>{claimTime}</span>}
          </h1>
        </div>
        <div className="column is-2">
          {stakedMoonrunners.length  > 0 && claimTime && (
            <img className="clock-img" src={clock} alt="clock" />
          )}
        </div>
      </div>
      <div className="column is-1"></div>
    </>
  );
};

export default Trophies;
