import { useContext, useEffect, useState } from "react";
import { SetupContext } from "../index.js";
import { useProvider } from "./useProvider.js";
import { ethers } from "ethers";

const idToNameMapping = {
  0: 'Arcane Ray Gun',
  1: 'Deciphered Eldritch Scroll', 
  2: 'AR-15',
  3: 'Combat Claws',
  4: 'Melchizedek of Dragon Blood', // legendary blood
  5: 'Nebuchadnezzar of Dragon Blood', // epic blood 
  6: 'Balthazar of Dragon Blood', // rare blood 
  7: 'Almanazar of Dragon Blood', // common blood 
  8: 'Dragonbane', 
  9: 'Moon Staff',
  10: 'Free Merch Voucher',
  11: '50% Discount Merch Voucher',
  12: 'Resplendent Chest'
};

export const usePrimordia = () => {
  const { primordiaContract, primordiaAbi } = useContext(SetupContext);
  const { provider, signer } = useProvider();

  const [primordiaObjects, setPrimordiaObjects] = useState([]);
  const [primordiaWeapons, setPrimordiaWeapons] = useState([])
  const [primordiaBlood, setPrimordiaBlood] = useState([])
  const [primordiaTickets, setPrimordiaTickets] = useState([])

  const primordiaContractConnected = !!signer
    ? new ethers.Contract(primordiaContract, primordiaAbi, provider).connect(signer)
    : undefined;

  const getPrimordiaItems = async () => {
    const primordiaItems = await primordiaContractConnected.getItems();
    createPrimordiaObject(primordiaItems)
    console.log(primordiaItems.uri)
  };

  async function createPrimordiaObject(primordiaItems) {
    const primordiaCollection = await Promise.all(
      primordiaItems.map(async (primordiaItem) => {
        let uri = primordiaItem.uri;
        let data = {};
        if (uri.includes('ipfs://')) {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${uri.split('ipfs://')[1]}`);
          data = await response.json();
        } else if (uri.includes('https://gateway.pinata.cloud/ipfs/')) {
          const response = await fetch(uri);
          data = await response.json();
        }
        return {
          id: primordiaItem.id.toNumber(),
          name: idToNameMapping[primordiaItem.id.toNumber()],
          image: data.image,
        };
      })
    );
    setPrimordiaObjects(primordiaCollection);
    setPrimordiaWeapons(primordiaCollection.filter(item => [0, 1, 2, 3, 8, 9].includes(item.id)));
    setPrimordiaBlood(primordiaCollection.filter(item => [4, 5, 6, 7].includes(item.id)));
    setPrimordiaTickets(primordiaCollection.filter(item => [10, 11].includes(item.id)));
  }

  useEffect(() => {
    getPrimordiaItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primordiaContract, primordiaAbi]);

  return {
    primordiaObjects,
    primordiaWeapons,
    primordiaBlood,
    primordiaTickets
  };
};
