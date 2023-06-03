import { useEffect, useRef, useState } from "react";
import { sampleSize } from "lodash";
import { ethers } from "ethers";
import Gutter from "./Gutter";

import axios from "axios";
import imageCompression from "browser-image-compression";
import "./Raffles.css";
import "./Admin.css";

import { useProvider } from "../hooks/useProvider";
import { useRaffles } from "../hooks/useRaffles";
import CONTRACT_INFO from "../ContractInfo";

const Admin = () => {
  const { signer } = useProvider();
  const { allRaffles } = useRaffles();
  const [authorized, setAuthorized] = useState(false);
  const [userSignature, setUserSignature] = useState();
  const [showEditModal, setShowEditModal] = useState();

  const imageInputRef = useRef(null);
  const [raffleToEdit, setRaffleToEdit] = useState({
    name: "",
    description: "",
    drawDate: 0,
    image: "",
    winners: [],
  });

  async function checkAuthorization() {
    const addressesToVerify = [
      "0xd32b4524A1FBC8417ccDA8905561C4437Afbf858",
      "0xE03E3F9aD56862184594F95811bD18cDC0Bab495",
      "0x556ef85398E60E053955A74365773Ae06B1a8E1c",
      "0x366d0741bD7b994D345e1095A14a560f25a0D20f",
      "0x93601eD6415F675FCD9beA0d86DDb1b167F1a578",
    ];
    const messageToSign = "Verify wallet ownership";

    const signature = await signer.signMessage(messageToSign);

    setUserSignature(signature);

    const recoveredAddress = ethers.utils.verifyMessage(
      messageToSign,
      signature
    );
    const isAuthorized = addressesToVerify.some(
      (address) => recoveredAddress.toLowerCase() === address.toLowerCase()
    );
    if (isAuthorized) {
      console.log(
        `The signature is valid and was signed by one of the expected addresses: ${addressesToVerify.join(
          ", "
        )}`
      );
      setAuthorized(true);
    } else {
      console.log(
        `The signature is invalid or was not signed by any of the expected addresses: ${addressesToVerify.join(
          ", "
        )}`
      );
    }
    console.log(signature);
  }

  const updateRaffle = async (event) => {
    event.preventDefault();

    const updatedRaffle = {
      ...raffleToEdit,
      signature: userSignature,
    };

    try {
      const response = await axios.put(
        `https://moonrunners.herokuapp.com/api/raffles/${updatedRaffle.id}`,
        updatedRaffle,
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      alert("Raffle updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update raffle.");
    }
  };

  function openEditModal(raffleId) {
    const findRaffleToEdit = allRaffles.find((obj) => obj.id === raffleId);
    setRaffleToEdit(findRaffleToEdit);
    setShowEditModal(true);
  }

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    checkAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {authorized ? (
        <div className="raffles-section">
          <div className="container">
            <div className="raffles-body">
              <div className="container raffles-body-container">
                {/* admin heading */}
                <div className="columns raffles-heading is-vcentered is-centered">
                  <div className="column is-10 raffles-title-column has-text-centered">
                    <div className="raffles-title">
                      Admin
                      <br />
                      <div className="raffles-trophy-text">
                        Start raffles and upload metadata
                      </div>
                      <div className="is-size-7 admin-warning">
                        Note that minimum trophy requirement is set through
                        contract and cannot be changed.
                      </div>
                    </div>
                  </div>
                  <div className="column is-2 raffles-title-column has-text-centered">
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={`https://${
                        window.chain === "goerli" ? "goerli." : ""
                      }etherscan.io/address/${
                        CONTRACT_INFO[window.chain].rafflesContract
                      }#writeProxyContract`}
                    >
                      <button className="button is-warning">
                        Create Raffle
                      </button>
                    </a>
                  </div>
                </div>
                <div className="columns raffles-content is-multiline is-centered">
                  {allRaffles.map((raffle) => (
                    <div
                      className="column is-one-fifth has-text-centered raffle-object"
                      key={raffle.id}
                    >
                      <div className="raffle-object-trophy">
                        {raffle.minimumTrophy}
                      </div>
                      <div> {raffle.name}</div>
                      <img alt="raffle" src={raffle.image} />
                      <div>ENDS: {raffle.endDate}</div>
                      <div className="raffle-buttons">
                        <button
                          className="button is-warning enter-button"
                          alt="enter-button"
                          onClick={() => openEditModal(raffle.id)}
                        >
                          EDIT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="raffles-section">
          <div className="container">
            <div className="raffles-body">
              <div className="container raffles-body-container">
                {/* admin heading */}
                <div className="columns raffles-heading is-vcentered is-centered">
                  <div className="column is-7 raffles-title-column has-text-centered">
                    <div className="raffles-title">
                      Admin
                      <br />
                      <div className="raffles-trophy-text">
                        Should you be here?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Gutter />
      {/* EDIT MODAL  */}
      <div className={`modal raffle-modal ${showEditModal ? "is-active" : ""}`}>
        <div className="modal-background"> </div>
        <div className="modal-card raffle-modal">
          <header className="raffle-modal-head">
            <button
              className="delete is-large raffle-close-modal"
              aria-label="close"
              onClick={closeEditModal}
            />
          </header>
          <section className="modal-card-body">
            <div>
              <div>
                <h1>Update Raffle Metadata</h1>
                <div className="is-size-7 admin-warning">
                  Note that minimum trophy requirement is set through contract
                  and cannot be changed{" "}
                </div>
                {raffleToEdit.image && (
                  <div>
                    <img
                      alt="not found"
                      width={"250px"}
                      src={raffleToEdit.image}
                    />
                  </div>
                )}
                <br />

                <br />
                <input
                  type="file"
                  name="myImage"
                  ref={imageInputRef}
                  onChange={async (event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onloadend = async () => {
                      const compressedImage =
                        await imageCompression.getDataUrlFromFile(file);
                      setRaffleToEdit({
                        ...raffleToEdit,
                        image: compressedImage,
                      });
                    };
                  }}
                />
              </div>
              <br />

              <div>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={raffleToEdit.name}
                    onChange={(e) =>
                      setRaffleToEdit({
                        ...raffleToEdit,
                        name: e.target.value,
                      })
                    }
                  />
                </label>
                <br />
                <br />
                <label>
                  Description:
                  <input
                    type="text"
                    name="description"
                    value={raffleToEdit.description}
                    onChange={(e) =>
                      setRaffleToEdit({
                        ...raffleToEdit,
                        description: e.target.value,
                      })
                    }
                  />
                </label>
                <br />
                <br />
                <label>
                  Pick winners:
                  <select
                    onChange={(e) => {
                      const numOfWinners = Number(e.target.value);
                      const winners = sampleSize(
                        raffleToEdit.entries,
                        numOfWinners
                      );
                      setRaffleToEdit({
                        ...raffleToEdit,
                        winners,
                      });
                    }}
                  >
                    <option value={0}>No winner</option>
                    {(raffleToEdit.entries || []).map((entry, index) => (
                      <option value={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                </label>
                <br />
                <br />
                <label>
                  Draw Date (in unixTimestamp):
                  <div className="is-size-7">
                    You can enter date
                    <a
                      href="https://www.unixtimestamp.com/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      here
                    </a>
                    and get the unixTimestamp
                  </div>
                  <input
                    type="number"
                    name="drawDate"
                    value={raffleToEdit.drawDate}
                    onChange={(e) =>
                      setRaffleToEdit({
                        ...raffleToEdit,
                        drawDate: e.target.value,
                      })
                    }
                  />
                </label>
                <br />
              </div>
              <br />
              <button className="button is-warning" onClick={updateRaffle}>
                Edit Raffle
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Admin;
