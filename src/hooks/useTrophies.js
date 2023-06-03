import { useContext, useEffect, useState } from "react";
import { useProvider } from "./useProvider";
import { SetupContext } from "../index.js";
import { ethers } from "ethers";

export const useTrophies = () => {
  const { address, trophiesContract, trophiesAbi } = useContext(SetupContext);
  const { provider, signer } = useProvider();

  const trophiesContractConnected = !!signer
    ? new ethers.Contract(trophiesContract, trophiesAbi, provider).connect(
        signer
      )
    : undefined;

  const [userTrophy, setUserTrophy] = useState(null);
  const [claimTime, setClaimTime] = useState(null);
  const [possibleTrophyClaim, setPossibleTrophyClaim] = useState(0);

  async function checkTrophy() {
    const trophyIds = [4, 3, 2, 1];
    if (signer) {
      const userTrophyBalance = await trophiesContractConnected.balanceOfBatch(
        [
          signer.getAddress(),
          signer.getAddress(),
          signer.getAddress(),
          signer.getAddress(),
        ],
        trophyIds
      );

      const possibleTrophyId =
        await trophiesContractConnected.getPossibleTrophyClaim();
      const trophyIdAvailableToUser = possibleTrophyId.toNumber();
      setPossibleTrophyClaim(trophyIdAvailableToUser);
      const trophies = userTrophyBalance.toString();
      const trophyBalanceOfBatch = trophies.split(",");

      for (let i = 0; i < trophyBalanceOfBatch.length; i++) {
        if (trophyBalanceOfBatch[i] === "1") {
          setUserTrophy(trophyIds[i]);
          break;
        }
      }
    }
  }

  async function checkStakedTime() {
    const stake = await new trophiesContractConnected.getStake(address);
    const stakingPeriodInBigNumber =
      await trophiesContractConnected.stakingPeriod();
    const stakedTimestampUnix = stake.timestamp.toNumber();
    const stakingPeriodInSeconds = stakingPeriodInBigNumber.toNumber();
    const today = Math.floor(Date.now() / 1000);
    const diffTime = stakedTimestampUnix + stakingPeriodInSeconds - today;

    if (userTrophy > 0) {
      setClaimTime(null);
    } else {
      if (diffTime <= 0) {
        setClaimTime(null);
      } else if (diffTime <= 3600) {
        const minutes = Math.floor(diffTime / 60);
        const timeLeft = `in ${minutes} minute${minutes > 1 ? "s" : ""}`;
        setClaimTime(timeLeft);
      } else if (diffTime <= 86400) {
        const hours = Math.floor(diffTime / 3600);
        const timeLeft = `in ${hours} hour${hours > 1 ? "s" : ""}`;
        setClaimTime(timeLeft);
      } else if (diffTime >= 86400) {
        const days = Math.floor(diffTime / 86400);
        const timeLeft = `in ${days} day${days > 1 ? "s" : ""}`;
        setClaimTime(timeLeft);
      }
    }
  }

  useEffect(() => {
    checkStakedTime();
    checkTrophy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimTime]);

  return {
    userTrophy,
    possibleTrophyClaim,
    claimTime,
    checkTrophy,
  };
};
