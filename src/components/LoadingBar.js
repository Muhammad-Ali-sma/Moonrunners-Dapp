import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { SetupContext } from "../index.js";
import { useProvider } from "../hooks/useProvider.js";

import "./LoadingBar.css";

import bouncingWolf from "../assets/bouncing-wolf.gif";

const LoadingBar = () => {
  const [percentageStaked, setPercentageStaked] = useState("");
  const [absoluteStaked, setAbsoluteStaked] = useState();
  const [moonrunnerOffset, setMoonrunnerOffset] = useState("");

  const [totalTokens, setTotalTokens] = useState();

  const { mrContract, mrAbi, trophiesContract } = useContext(SetupContext);
  const { provider, signer } = useProvider();

  const mrContractConnected = !!provider
    ? new ethers.Contract(mrContract, mrAbi, provider).connect(signer)
    : undefined;

  async function getTokens() {
    if (signer) {
      const totalSupply = await mrContractConnected.totalSupply();
      const totalSupplyString = totalSupply.toString();
      const totalSupplyNumber = Number(totalSupplyString);

      setTotalTokens(totalSupplyNumber);

      const balanceOfTokensStaked = await mrContractConnected.balanceOf(
        trophiesContract
      );

      const numberOfStakedTokens = balanceOfTokensStaked.toNumber();

      setAbsoluteStaked(numberOfStakedTokens);

      const percentageStaked = (numberOfStakedTokens / totalSupplyNumber) * 100;

      const percentageStakedString = percentageStaked + "%";

      const moonrunnnerPercentageOffset = percentageStaked - 10 + "%";

      setMoonrunnerOffset(moonrunnnerPercentageOffset);

      setPercentageStaked(percentageStakedString);
    }
  }

  async function setup() {
    await getTokens();
  }

  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="column">
        <div className="loading-bar">
          <div
            className="loading-bar-progress"
            style={{
              position: "absolute",
              width: percentageStaked,
              height: "100%",
            }}
          ></div>
          <div
            className="loading-bar-moonrunner"
            style={{
              marginLeft: moonrunnerOffset,
              position: "relative",
              width: "20%",
              height: "100%",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              alt="cursor"
              src={bouncingWolf}
              className="loading-bar-img"
            ></img>
          </div>
        </div>
      </div>
      <div></div>
      <div className="columns is-centered is-vcentered">
        <div className="number-staked">
          {absoluteStaked} / {totalTokens} staked
        </div>
      </div>
    </>
  );
};

export default LoadingBar;
