import { useContext, useEffect, useState } from "react";
import { SetupContext } from "../index.js";
import { useProvider } from "./useProvider.js";
import { ethers } from "ethers";

export const useTokens = () => {
  const { address, mrContract, mrAbi, trophiesContract, trophiesAbi } =
    useContext(SetupContext);
  const { provider, signer } = useProvider();

  const mrContractConnected = !!signer
    ? new ethers.Contract(mrContract, mrAbi, provider).connect(signer)
    : undefined;
  const trophiesContractConnected = !!signer
    ? new ethers.Contract(trophiesContract, trophiesAbi, provider).connect(
        signer
      )
    : undefined;

  const [allMoonrunners, setAllMoonrunners] = useState([]);
  const [stakedMoonrunners, setStakedMoonrunners] = useState([]);
  const [unstakedMoonrunners, setUnstakedMoonrunners] = useState([]);

  function createTokenObject(tokenId, isStaked) {
    return {
      tokenId: tokenId.toString(),
      isStaked: isStaked,
    };
  }

  const refetchTokens = async () => {
    const ownerTokenIds = await mrContractConnected.tokensOfOwner(address);
    const stake = await trophiesContractConnected.getStake(address);
    const stakedTokenIds = stake.tokenIds;
    const ownerTokens = ownerTokenIds.map((tokenId) => ({
      tokenId: tokenId.toString(),
      isStaked: false,
    }));
    const stakedTokens = stakedTokenIds.map((id) =>
      createTokenObject(id, true)
    );
    const allTokens = ownerTokens.concat(stakedTokens);
    const stakedMoonrunnersHook = stakedTokens.map((token) => token.tokenId);
    setAllMoonrunners(allTokens);
    setStakedMoonrunners(stakedMoonrunnersHook);
    setUnstakedMoonrunners(ownerTokens);
  };

  useEffect(() => {
    refetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, mrContract, trophiesContract]);

  return {
    allMoonrunners,
    stakedMoonrunners,
    unstakedMoonrunners,
    refetchTokens,
  };
};
