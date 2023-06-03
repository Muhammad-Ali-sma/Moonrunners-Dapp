import { useContext, useEffect, useState } from "react";
import Gutter from "./Gutter";

import enterRaffleButton from "../assets/enter-raffle-button.png";
import infoRaffleButton from "../assets/info-raffle-button.png";
import resultsButton from "../assets/results-button.png";
import viewWalletsButton from "../assets/view-wallets-button.png";

import "./Raffles.css";
import { useRaffles } from "../hooks/useRaffles";
import { SetupContext } from "..";
import { useProvider } from "../hooks/useProvider";
import { ethers } from "ethers";
import { useTokens } from "../hooks/useTokens";
import { useTrophies } from "../hooks/useTrophies";
import { toLower } from "lodash";

const trophyIds = {
  bronze: 1,
  silver: 2,
  gold: 3,
  diamond: 4,
};

const diamondTrophyId = 4;
const goldTrophyId = 3;
const silverTrophyId = 2;
const bronzeTrophyId = 1;

const trophyIdsFromContract = [
  diamondTrophyId,
  goldTrophyId,
  silverTrophyId,
  bronzeTrophyId,
];

const Raffles = () => {
  const { allRaffles, activeRaffles, completedRaffles } = useRaffles();
  const { stakedMoonrunners } = useTokens();
  const { provider, signer } = useProvider();
  const {
    address,
    trophiesAbi,
    trophiesContract,
    rafflesContract,
    rafflesAbi,
  } = useContext(SetupContext);
  const { userTrophy } = useTrophies();

  const [activeTab, setActiveTab] = useState("active");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const [showRaffleEntries, setShowRaffleEntries] = useState();
  const [raffleWallets, setRaffleWallets] = useState("");
  const [raffleDrawDate, setRaffleDrawDate] = useState("");
  const [raffleWinners, setRaffleWinners] = useState("");

  const [raffleCloseDate, setRaffleCloseDate] = useState();
  const [raffleToShow, setRaffleToShow] = useState({
    name: "",
    description: "",
    drawDate: 0,
    image: "",
    winners: [],
    entries: [],
  });

  const [stakingText, setStakingText] = useState("0");
  const [userTrophyText, setUserTrophyText] = useState("no");
  const [raffleEligibility, setRaffleEligibility] = useState(0);
  const [raffleEligibilityText, setRaffleEligibilityText] =
    useState("no raffles");

  function generateEligibilityText() {
    // trophy text
    if (userTrophy === 4) {
      setUserTrophyText("a diamond");
    } else if (userTrophy === 3) {
      setUserTrophyText("a gold");
    } else if (userTrophy === 2) {
      setUserTrophyText("a silver");
    } else if (userTrophy === 1) {
      setUserTrophyText("a bronze");
    }

    // staking text
    if (stakedMoonrunners.length === 0) {
      setStakingText("0");
    } else {
      setStakingText(stakedMoonrunners.length);
    }

    if (raffleEligibility === 4) {
      setRaffleEligibilityText("diamond raffles and below");
    } else if (raffleEligibility === 3) {
      setRaffleEligibilityText("gold raffles and below");
    } else if (raffleEligibility === 2) {
      setRaffleEligibilityText("silver raffles and below");
    } else if (raffleEligibility === 1) {
      setRaffleEligibilityText("bronze raffles");
    }
  }

  const trophiesContractConnected = !!provider
    ? new ethers.Contract(trophiesContract, trophiesAbi, provider).connect(
        signer
      )
    : undefined;

  async function checkClaimedTrophy() {
    const userTrophyBalance = await trophiesContractConnected.balanceOfBatch(
      [address, address, address, address],
      trophyIdsFromContract
    );
    const trophies = userTrophyBalance.toString();
    const trophyBalanceOfBatch = trophies.split(",");

    if (trophyBalanceOfBatch[0] === "1" && stakedMoonrunners.length >= 25) {
      setRaffleEligibility(4);
    } else if (
      (trophyBalanceOfBatch[0] === "1" || trophyBalanceOfBatch[1] === "1") &&
      stakedMoonrunners.length >= 10
    ) {
      setRaffleEligibility(3);
    } else if (
      (trophyBalanceOfBatch[0] === "1" ||
        trophyBalanceOfBatch[1] === "1" ||
        trophyBalanceOfBatch[2] === "1") &&
      stakedMoonrunners.length >= 5
    ) {
      setRaffleEligibility(2);
    } else if (
      (trophyBalanceOfBatch[0] === "1" ||
        trophyBalanceOfBatch[1] === "1" ||
        trophyBalanceOfBatch[2] === "1" ||
        trophyBalanceOfBatch[3] === "1") &&
      stakedMoonrunners.length >= 1
    ) {
      setRaffleEligibility(1);
    }
  }

  useEffect(() => {
    checkClaimedTrophy();
    generateEligibilityText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakedMoonrunners, trophiesContractConnected]);

  const rafflesContractConnected = !!signer
    ? new ethers.Contract(rafflesContract, rafflesAbi, provider).connect(signer)
    : undefined;

  function setActiveRaffleInfo(id) {
    const findRaffleToShow = allRaffles.find((obj) => obj.id === id);
    setRaffleToShow(findRaffleToShow);

    const raffle = allRaffles.find((raffle) => raffle.id === id);

    const raffleCloseDate = raffle.endDate;

    setRaffleCloseDate(raffleCloseDate);

    let date = new Date(raffle.drawDate * 1000);
    const dateString = date.toLocaleDateString().replaceAll("-", "/");
    setRaffleDrawDate(dateString);
    setShowInfoModal(true);

    const walletEntries = raffle.entries.join("\r\n");
    setRaffleWallets(walletEntries);
  }

  function setCompletedRaffleInfo(id) {
    const findRaffleToShow = allRaffles.find((obj) => obj.id === id);
    setRaffleToShow(findRaffleToShow);
    const raffle = allRaffles.find((raffle) => raffle.id === id);

    let date = new Date(raffle.drawDate * 1000);
    const dateString = date.toLocaleDateString();
    const formattedDate = dateString.replaceAll("-", "/");

    const raffleCloseDate = raffle.endDate.replaceAll("-", "/");

    setRaffleCloseDate(raffleCloseDate);
    setRaffleDrawDate(formattedDate);

    const winnerWallets = raffle.winners;
    const winnerList = winnerWallets.map((wallet, index) => (
      <p key={index}>{wallet}</p>
    ));

    setRaffleWinners(winnerList);
    setShowCompletedModal(true);

    const walletEntries = raffle.entries.join("\r\n");
    setRaffleWallets(walletEntries);
  }

  const closeCompletedModal = () => {
    setShowCompletedModal(false);
    setShowRaffleEntries(false);
  };

  const handleShowEntries = () => {
    setShowRaffleEntries(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setShowRaffleEntries(false);
  };

  const openTxModal = (id) => {
    enterRaffle(id);
    setShowTxModal(true);
  };

  const closeTxModal = () => {
    setShowTxModal(false);
    setPendingTx(null);
  };

  async function enterRaffle(id) {
    const response = await rafflesContractConnected.enterRaffle(id, 5);
    setPendingTx(response.hash);
  }

  return (
    <>
      <div className="raffles-section">
        <div className="container">
          <div className="raffles-body">
            <div className="container raffles-body-container">
              {/* Raffle heading */}
              <div className="columns raffles-heading is-vcentered is-centered">
                <div className="is-6 raffles-title-column has-text-center">
                  <div className="raffles-info-report">
                    You currently have {userTrophyText} trophy
                    <br />
                    You have {stakingText} Moonrunners staked
                    <br />
                    You are eligible for {raffleEligibilityText}
                  </div>
                </div>
                <div className="column is-offset-1 raffles-title-column has-text-center">
                  <div
                    className={`raffles-title active-title ${
                      activeTab === "completed" ? "grayed-title" : ""
                    }`}
                    onClick={() => setActiveTab("active")}
                  >
                    Active Raffles
                  </div>
                </div>
                <div className="column raffles-title-column has-text-center">
                  <div
                    className={`raffles-title  completed-title ${
                      activeTab === "active" ? "grayed-title" : ""
                    }`}
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed Raffles
                  </div>
                </div>
              </div>

              {/* filter */}
              <div className="columns raffles-filter is-vcentered is-centered">
                <div className="column is-narrow"> Filter:&nbsp;</div>
                <div
                  className={`column is-narrow trophy-filter ${
                    selectedFilter === "All" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFilter("All")}
                >
                  All&nbsp;<span className="filter-pipe">|</span>
                </div>
                <div
                  className={`column is-narrow trophy-filter ${
                    selectedFilter === "diamond" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFilter("diamond")}
                >
                  Diamond&nbsp;<span className="filter-pipe">|</span>
                </div>
                <div
                  className={`column is-narrow trophy-filter ${
                    selectedFilter === "gold" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFilter("gold")}
                >
                  Gold&nbsp;<span className="filter-pipe">|</span>
                </div>
                <div
                  className={`column is-narrow trophy-filter ${
                    selectedFilter === "silver" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFilter("silver")}
                >
                  Silver&nbsp;<span className="filter-pipe">|</span>
                </div>
                <div
                  className={`column is-narrow trophy-filter ${
                    selectedFilter === "bronze" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFilter("bronze")}
                >
                  Bronze
                </div>
              </div>

              {/* Raffle events */}
              <div className="columns raffles-content is-multiline is-centered raffles-box">
                {activeTab === "active"
                  ? activeRaffles
                      .filter(
                        (raffle) =>
                          selectedFilter === "All" ||
                          raffle.minimumTrophy.toLowerCase() ===
                            selectedFilter.toLowerCase()
                      )
                      .map((raffle) => {
                        const entered = raffle.entries
                          .map(toLower)
                          .includes(toLower(address));
                        const eligible =
                          trophyIds[raffle.minimumTrophy] <= raffleEligibility;
                        return (
                          <div
                            className={`column is-one-fifth has-text-centered raffle-object ${raffle.minimumTrophy}`}
                            key={raffle.id}
                          >
                            <div className="raffle-object-trophy">
                              {raffle.minimumTrophy}
                            </div>
                            <div className="raffle-name"> {raffle.name}</div>
                            <figure class="raffle-image image is-square image is-square ">
                              <img alt="raffle" src={raffle.image} />
                            </figure>
                            <div>ENDS: {raffle.endDate.split(" ")[0]}</div>
                            {entered && eligible && (
                              <div className="entered-text">ENTERED</div>
                            )}
                            {entered && !eligible && (
                              <div className="not-eligible">
                                ENTERED, BUT NOT ELIGIBLE
                              </div>
                            )}
                            {!entered && !eligible && (
                              <div className="not-eligible">NOT ELIGIBLE</div>
                            )}
                            <div className="raffle-buttons">
                              {(eligible || entered) && (
                                <>
                                  <img
                                    onClick={() => {
                                      if (!entered) {
                                        openTxModal(raffle.id);
                                      }
                                    }}
                                    className={`enter-button ${
                                      entered ? "enter-raffle-disabled" : ""
                                    }`}
                                    src={enterRaffleButton}
                                    alt="enter-button"
                                  />
                                </>
                              )}
                              <img
                                onClick={() => setActiveRaffleInfo(raffle.id)}
                                className="info-button"
                                src={infoRaffleButton}
                                alt="info-button"
                              />
                            </div>
                          </div>
                        );
                      })
                  : completedRaffles
                      .filter(
                        (raffle) =>
                          selectedFilter === "All" ||
                          raffle.minimumTrophy.toLowerCase() ===
                            selectedFilter.toLowerCase()
                      )
                      .map((raffle) => (
                        <div
                          className={`column is-one-fifth has-text-centered raffle-object ${raffle.minimumTrophy}`}
                          key={raffle.id}
                        >
                          <div className="raffle-object-trophy">
                            {raffle.minimumTrophy}
                          </div>
                          <div className="raffle-name"> {raffle.name} </div>
                          <figure className="raffle-image image is-square image is-square ">
                            <img alt="raffle" src={raffle.image} />
                          </figure>
                          <div>COMPLETED</div>
                          <div className="raffle-buttons">
                            <img
                              onClick={() => setCompletedRaffleInfo(raffle.id)}
                              className="info-button"
                              src={resultsButton}
                              alt="info-button"
                            />
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>

          {/* Modals */}
          {/*  Info Modal */}
          <div
            className={`modal raffle-modal ${showInfoModal ? "is-active" : ""}`}
          >
            <div className="modal-background"> </div>
            <div className="modal-card raffle-modal">
              <header className="raffle-modal-head">
                <button
                  className="delete is-large raffle-close-modal"
                  aria-label="close"
                  onClick={closeInfoModal}
                />
              </header>
              <section className="modal-card-body">
                <div>
                  <img
                    className="info-modal-image"
                    alt="raffle"
                    src={raffleToShow.image}
                  />
                  <div className="info-modal-body-text">
                    <div className="info-raffle-title">
                      {raffleToShow.minimumTrophy} raffle: {raffleToShow.name}
                    </div>
                    <div>{raffleToShow.description}</div>
                    <br />
                    <div>
                      THE DATE FORMAT IS IN DD/MM/YYYY, THE TIME SHOWN IS IN
                      HH:MM:SS AND THE RAFFLE AND DRAW TIME ARE IN YOUR LOCAL
                      TIME
                    </div>
                    <br />
                    <div className="columns">
                      <div className="column">
                        <div className="raffle-closing-title">
                          Raffle Closes
                        </div>
                        {raffleToShow.endDate}
                      </div>
                      <div className="column">
                        <div className="raffle-closing-title">Raffle draw</div>
                        {raffleDrawDate}
                      </div>
                    </div>
                    <div>
                      Winners need to claim the prize within 48 hours through
                      our discord
                    </div>
                    <br />
                    <div className="raffle-unstake-text">
                      if the winner unstaked moonrunners after entering the
                      raffle the wallet will be disqualified
                    </div>
                    <br />
                    <div>
                      {raffleToShow.entries[0]?.length <= 0 ? null : (
                        <div>entries: {raffleToShow.entries?.length || 0}</div>
                      )}
                    </div>
                    <br />
                    {showRaffleEntries ? (
                      <div className="raffle-entries-wallets">
                        {raffleWallets}
                      </div>
                    ) : raffleToShow.entries[0]?.length > 0 ? (
                      <img
                        onClick={() => handleShowEntries()}
                        className="view-wallets-button"
                        alt="view-wallets"
                        src={viewWalletsButton}
                      />
                    ) : null}
                  </div>
                </div>
                <br />
              </section>
            </div>
          </div>

          {/*  Completed Modal */}
          <div
            className={`modal raffle-modal ${
              showCompletedModal ? "is-active" : ""
            }`}
          >
            <div className="modal-background"> </div>
            <div className="modal-card raffle-modal">
              <header className="raffle-modal-head">
                <button
                  className="delete is-large raffle-close-modal"
                  aria-label="close"
                  onClick={closeCompletedModal}
                />
              </header>
              <section className="modal-card-body">
                <div>
                  <img
                    className="info-modal-image"
                    alt="raffle"
                    src={raffleToShow.image}
                  />
                  <div className="info-modal-body-text">
                    <div className="info-raffle-title">
                      {raffleToShow.minimumTrophy} raffle: {raffleToShow.name}
                    </div>
                    <div> {raffleToShow.description} </div>
                    <br />
                    <div className="columns">
                      <div className="column">
                        <div className="raffle-closing-title">
                          Raffle Closes
                        </div>
                        {raffleCloseDate}
                      </div>
                      <div className="column">
                        <div className="raffle-closing-title">Raffle draw</div>
                        {raffleDrawDate}
                      </div>
                    </div>
                    <div>
                      Winners need to claim the prize within 48 hours through
                      our discord
                    </div>
                    <br />
                    <div className="raffle-unstake-text">
                      if the winner unstaked moonrunners after entering the
                      raffle the wallet will be disqualified
                    </div>
                    <br />
                    <div className="winners-title"> winners </div>
                    <br />
                    <div className="winner-container"> {raffleWinners} </div>
                    <br />
                  </div>
                </div>
                <br />
              </section>
            </div>
          </div>
        </div>
      </div>

      {/*  Tx Modal */}
      <div className={`modal ${showTxModal ? "is-active" : ""}`}>
        <div className="modal-background"> </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title"> Enter raffle</p>
            <button
              className="delete is-large"
              aria-label="close"
              onClick={closeTxModal}
            />
          </header>

          <section className="modal-card-body">
            <p>
              You can watch your tx here:
              <a
                target="_blank"
                href={`https://${
                  window.chain === "goerli" ? "goerli." : ""
                }etherscan.io/tx/${pendingTx}`}
                rel="noreferrer"
              >
                &nbsp;Tx hash&nbsp;
              </a>
            </p>
          </section>
        </div>
      </div>
      <Gutter />
    </>
  );
};

export default Raffles;
