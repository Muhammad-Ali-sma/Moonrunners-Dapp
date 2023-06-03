import { React, useEffect, useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bulma/css/bulma.min.css";
import "./index.css";

import CONTRACT_INFO from "./ContractInfo";
import Staking from "./components/Staking";
import Raffles from "./components/Raffles";
import Primordia from "./components/Primordia";
import Faq from "./components/Faq";
import Roadmap from "./components/Roadmap";
import Admin from "./components/Admin";
import LayoutComponent from "./components/LayoutComponent";

export const SetupContext = createContext();

const mrContract = CONTRACT_INFO[window.chain].mrContract;
const trophiesContract = CONTRACT_INFO[window.chain].trophiesContract;
const rafflesContract = CONTRACT_INFO[window.chain].rafflesContract;
const primordiaContract = CONTRACT_INFO[window.chain].primordiaContract;

const mrAbi = CONTRACT_INFO.mrAbi;
const trophiesAbi = CONTRACT_INFO.trophiesAbi;
const rafflesAbi = CONTRACT_INFO.rafflesAbi;
const primordiaAbi = CONTRACT_INFO.primordiaAbi;


export default function App() {
  const [walletAddress, setWalletAddress] = useState("");

  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("metamask not detected");
    }
  }

  useEffect(() => {
    requestAccount();
  }, []);

  return (
    <>
      <SetupContext.Provider
        value={{
          address: walletAddress,
          connect: requestAccount,
          mrContract,
          trophiesContract,
          rafflesContract,
          primordiaContract,
          mrAbi,
          trophiesAbi,
          rafflesAbi,
          primordiaAbi,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <LayoutComponent>
                  <Staking />
                </LayoutComponent>
              }
            />
            <Route
              path="/primordia"
              element={
                <LayoutComponent>
                  <Primordia />
                </LayoutComponent>
              }
            />
            <Route
              path="/raffles"
              element={
                <LayoutComponent>
                  <Raffles />
                </LayoutComponent>
              }
            />
            <Route
              path="/staking"
              element={
                <LayoutComponent>
                  <Staking />
                </LayoutComponent>
              }
            />
            <Route
              path="/faq"
              element={
                <LayoutComponent>
                  <Faq />
                </LayoutComponent>
              }
            />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route
              path="/admin"
              element={
                <LayoutComponent>
                  <Admin />
                </LayoutComponent>
              }
            />
          </Routes>
        </BrowserRouter>
      </SetupContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
