import { createContext, useContext, useState } from "react";
import { SetupContext } from "../index";
import { ethers } from "ethers";
import "./Staking.css";
import Trophies from "./Trophies";
import LoadingBar from "./LoadingBar";

import connectButton from "../assets/connect-wallet-button.png";
import stakeButton from "../assets/stake-button.png";
import stakeAllButton from "../assets/stake-all-button.png";
import unstakeButton from "../assets/unstake-button.png";
import unstakeAllButton from "../assets/unstake-all-button.png";
import claimButton from "../assets/claim-button.png";
import star from "../assets/star.png";
import steak from "../assets/steak.png";
import Gutter from "./Gutter";

import { useTokens } from "../hooks/useTokens";
import { useProvider } from "../hooks/useProvider";
import { useTrophies } from "../hooks/useTrophies";

export const StakedTokensContext = createContext();

const Staking = () => {
  const { allMoonrunners, stakedMoonrunners, refetchTokens } = useTokens();
  const { provider, signer } = useProvider();
  const { possibleTrophyClaim } = useTrophies();
  const { address, connect, mrContract, trophiesContract, trophiesAbi, mrAbi } =
    useContext(SetupContext);

  const trophiesContractConnected = !!provider
    ? new ethers.Contract(trophiesContract, trophiesAbi, provider).connect(
        signer
      )
    : undefined;

  const mrContractConnected = !!provider
    ? new ethers.Contract(mrContract, mrAbi, provider).connect(signer)
    : undefined;

  const [showModal, setShowModal] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [activeTokens, setActiveTokens] = useState([]);

  const toggleClass = (tokenId) => {
    const newActiveTokens = [...activeTokens];
    if (newActiveTokens.includes(tokenId)) {
      const index = newActiveTokens.indexOf(tokenId);
      newActiveTokens.splice(index, 1);
    } else {
      newActiveTokens.push(tokenId);
    }
    setActiveTokens(newActiveTokens);
  };

  async function setApproveAll() {
    openModal();

    const setApprove = await mrContractConnected.setApprovalForAll(
      trophiesContract,
      true
    );
    setPendingTx(setApprove.hash);

    await setApprove.wait();
  }

  async function stake(tokenIds) {
    const isApproved = await mrContractConnected.isApprovedForAll(
      signer.getAddress(),
      trophiesContract
    );

    if (!isApproved) {
      console.error("Error: ERC-721 contract not approved");
      setApproveAll();
      return;
    }
    await trophiesContractConnected.stake(tokenIds);
    refetchTokens();
  }

  async function unstake(tokenids) {
    openWarningModal();
    await trophiesContractConnected.unstake(tokenids);
    refetchTokens();
  }

  async function claim() {
    await trophiesContractConnected.claim();
  }

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPendingTx(null);
  };

  const openWarningModal = () => {
    setShowWarningModal(true);
  };

  const closeWarningModal = () => {
    setShowWarningModal(false);
  };

  console.log(possibleTrophyClaim);

  return (
    <>
      <div className="staking-section">
        <div className="container">
          <div className="staking-body">
            <div className="container staking-body-container">
              <div className="columns staking-heading is-vcentered is-centered">
                <div className="column is-3 staking-title-column has-text-center">
                  <p className="staking-title">Wolf Report</p>
                </div>

                <div className="column">
                  <LoadingBar />
                </div>

                <div className="column is-5 has-text-right">
                  <br></br>
                  <Trophies />
                </div>
              </div>

              {!address && (
                <div className="columns is-centered has-text-centered">
                  <div className="column is-4">
                    <div onClick={connect}>
                      <img className="connect-btn" alt="connect" src={connectButton} />{" "}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {allMoonrunners && allMoonrunners.length > 0 ? (
              <>
                <div className="image-container container">
                  <div className="columns is-centered has-text-centered is-multiline">
                    {allMoonrunners.map((token) => (
                      <div
                        key={token.tokenId}
                        className="image-column column is-2 is-vcentered token-container"
                      >
                        <img
                          alt="moonrunner"
                          src={
                            "https://moonrunners.herokuapp.com/api/" +
                            token.tokenId +
                            "/image"
                          }
                          className={
                            stakedMoonrunners.includes(token.tokenId)
                              ? activeTokens.includes(token.tokenId)
                                ? "token-img-staked-bordered"
                                : "token-img-staked"
                              : activeTokens.includes(token.tokenId)
                              ? "token-img-bordered"
                              : "token-img"
                          }
                          onClick={() => toggleClass(token.tokenId)}
                          key={token.tokenId}
                        />
                        <div className="token-id"># {token.tokenId}</div>
                        {stakedMoonrunners.includes(token.tokenId) ? (
                          <div className="staked-text">
                            Staked{" "}
                            <span>
                              {" "}
                              <img
                                alt="steak"
                                className="steak-img"
                                src={steak}
                              ></img>
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="staking-footer">
                  <div className="container action-button-container ">
                    <div className="columns is-centered is-vcentered is-centered">
                      <div className="column is-1 wof-star-container">
                        <div>
                          <img
                            alt="wolf-of-fame"
                            className="wof-star"
                            src={star}
                          />{" "}
                        </div>
                      </div>
                      {allMoonrunners && allMoonrunners.length > 1 && (
                        <div className="column">
                          <div onClick={() => stake(activeTokens)}>
                            <img
                              alt="stake"
                              className="action-button"
                              src={stakeButton}
                            />{" "}
                          </div>
                        </div>
                      )}
                      <div className="column">
                        <div
                          onClick={() =>
                            stake(allMoonrunners.map((token) => token.tokenId))
                          }
                        >
                          <img
                            alt="stake-all"
                            className="action-button"
                            src={stakeAllButton}
                          />{" "}
                        </div>
                      </div>
                      {allMoonrunners && allMoonrunners.length > 1 && (
                        <div className="column">
                          <div onClick={() => unstake(activeTokens)}>
                            <img
                              alt="unstake"
                              className="action-button"
                              src={unstakeButton}
                            />{" "}
                          </div>
                        </div>
                      )}
                      <div className="column">
                        <div
                          onClick={() =>
                            unstake(
                              allMoonrunners.map((token) => token.tokenId)
                            )
                          }
                        >
                          <img
                            alt="unstake-all"
                            className="action-button"
                            src={unstakeAllButton}
                          />{" "}
                        </div>
                      </div>
                      <div className="column">
                        {possibleTrophyClaim ? (
                          <>
                            <div onClick={() => claim()}>
                              <img
                                alt="claim"
                                className="action-button"
                                src={claimButton}
                              />
                            </div>
                          </>
                        ) : (
                          <div
                            style={{
                              pointerEvents: "none",
                              filter: "grayscale(100%)",
                            }}
                          >
                            <img
                              className="action-button"
                              src={claimButton}
                              alt="claim-button"
                            />{" "}
                          </div>
                        )}
                      </div>

                      <div className="column is-1 wof-star-container">
                        <div>
                          <img
                            alt="wolf-of-fame"
                            className="wof-star"
                            src={star}
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="has-text-centered is-size-3">
                <h1 className="buy-text">
                  {" "}
                  Buy moonrunners on{" "}
                  <a href="https://opensea.io/collection/moonrunnersnft">
                    Opensea
                  </a>
                </h1>
              </div>
            )}
          </div>
        </div>

        <div
          className={`modal ${showModal ? "is-active" : ""}`}
          onBlur={closeModal}
        >
          <div className="modal-background"> </div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">NFTs not approved</p>
              <button
                className="delete is-large"
                aria-label="close"
                onClick={closeModal}
              />
            </header>

            <section className="modal-card-body">
              <p>
                Please approve the NFT contract before staking. Follow the
                metamask directions.{" "}
              </p>
              {pendingTx != null ? (
                <p>
                  You can watch your tx here:
                  <a
                    target="_blank"
                    href={`https://${
                      window.chain === "goerli" ? "goerli." : ""
                    }etherscan.io/tx/${pendingTx}`}
                    rel="noreferrer"
                  >
                    Tx hash
                  </a>
                </p>
              ) : (
                <p>
                  Your tx hash will appear here once you have approved it on
                  metamask
                </p>
              )}
            </section>
          </div>
        </div>

        <div className={`modal ${showWarningModal ? "is-active" : ""}`}>
          <div className="modal-background"> </div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Warning!</p>
              <button
                className="delete is-large"
                aria-label="close"
                onClick={closeWarningModal}
              />
            </header>

            <section className="modal-card-body">
              <p>
                {" "}
                You're about to unstake one or more Moonrunners, by doing so you
                might lose your trophy status, and you might miss out on
                utility, value and future airdrops. You will also need to claim
                your new soulbound trophy if you move to a new tier. Awooooo{" "}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Gutter />
    </>
  );
};

export default Staking;
