import { ethers } from "ethers";
import { useEffect, useState } from "react";

function getProvider() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    return {
      provider,
      signer,
    };
  } else {
    console.log("Please install MetaMask to use this dApp");
    return {};
  }
}

export const useProvider = () => {
  const walletInfo = getProvider();
  const [provider, setProvider] = useState(walletInfo.provider);
  const [signer, setSigner] = useState(walletInfo.signer);
  const fetchProvider = () => {
    if (provider && signer) {
      setProvider(provider);
      setSigner(signer);
    }
  };
  useEffect(() => {
    fetchProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.ethereum]);

  return {
    provider,
    signer,
  };
};
