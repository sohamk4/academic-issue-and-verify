import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import contractData2 from "../contracts/Degrees.json"

// Declare the ethereum property on the window object
if (typeof window.ethereum === "undefined") {
    console.warn("MetaMask not detected! Please install it.");
}

const CERTIFICATES_ADDRESS = "0xaA001aC0309a055986AfAd709DC7c70F3a6F1d26";

// Create the Web3 context
export const Web3Context = createContext({
    web3: null,
    contracts: null, // Single contracts object
    account: null,
    isLoading: true,
    error: null,
});

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contracts, setContracts] = useState(null); // Single contracts object
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeWeb3 = async () => {
          if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
      
            try {
              // Request account access
              const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
              if (accounts.length > 0) {
                setAccount(accounts[0]);
              } else {
                setError("No accounts found.");
              }
      
              // Initialize the contracts      
              const certificates = new web3Instance.eth.Contract(
                contractData2.abi,
                CERTIFICATES_ADDRESS
              );
      
              // Debug log to verify contract initialization
              console.log("Contracts initialized:", {
                certificates,
              });
      
              // Consolidate contracts into a single object
              setContracts(
                certificates,
              );
            } catch (error) {
              setError("Error initializing Web3. See console for details.");
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          } else {
            setError("MetaMask not detected! Please install it.");
            setIsLoading(false);
          }
        };
      
        initializeWeb3();
      }, []);
    return (
        <Web3Context.Provider value={{ web3, contracts, account, isLoading, error }}>
            {children}
        </Web3Context.Provider>
    );
};
