import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import deploy from "./deploy";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const benefNameRef = useRef();
  const aproverNamerRef = useRef();
  const valueRef = useRef();
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  const useStore = create(
    devtools(
      persist(
        (set) => ({
          escrows: [],
          handleDeploy: async () => {
            const beneficiary = benefNameRef.current?.value;
            const arbiter = aproverNamerRef.current?.value;
            const value = ethers.utils.parseEther(valueRef.current?.value);
            const escrowContract = await deploy(
              signer,
              arbiter,
              beneficiary,
              value
            );
            const name = escrowContract.address;
            set((state) => ({
              escrows: [...state.escrows, { name, arbiter, app: false }],
            }));
          },
          approve: async (escrowContract, sig) => {
            const approveTxn = await new ethers.Contract(
              escrowContract,
              Escrow.abi,
              sig
            ).approve();
            await approveTxn.wait();
            set((state) => {
              const updatedEscrows = state.escrows.map((item) => {
                if (item.name === escrowContract) {
                  return { ...item, app: true };
                }
                return item;
              });
              return { escrows: updatedEscrows };
            });
          },
        }),
        { getStorage: () => localStorage }
      )
    )
  );
  const { escrows, handleDeploy, approve } = useStore();

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" ref={aproverNamerRef} />
        </label>

        <label>
          Beneficiary Address
          <input type="text" ref={benefNameRef} />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" ref={valueRef} />
        </label>

        <div className="button" id="deploy" onClick={handleDeploy}>
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>
        <div id="container">
          <ol>
            {escrows &&
              escrows.map(({ name, arbiter, app }) => (
                <div key={name}>
                  {" "}
                  <li>
                    <p>Contract address {name}</p>
                    <p>Arbiter {arbiter}</p>
                  </li>
                  {app ? (
                    <h3>Contract was succesfully approved</h3>
                  ) : (
                    <button onClick={() => approve(name, signer)}>
                      Approve
                    </button>
                  )}
                </div>
              ))}
          </ol>
        </div>{" "}
      </div>
    </>
  );
}

export default App;
