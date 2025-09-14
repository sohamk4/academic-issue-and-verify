import React, { useContext, useEffect } from "react";
import { Web3Context } from "../context/Web3Context";

const CheckContracts = () => {
  const { contracts, account, isLoading } = useContext(Web3Context);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading contracts...");
      return;
    }

    const checkContracts = async () => {
      console.log("Contracts:", contracts); // Debug log
      console.log("Account:", account); // Debug log

      if (!contracts || !account) {
        console.error("Contracts or account not loaded.");
        return;
      }

      try {
        // Debug log to check the contracts object
        console.log("Contracts object:", contracts);

        // Check UniversityRegistry contract
        if (contracts.universityRegistry) {
          console.log("UniversityRegistry methods:", contracts.universityRegistry.methods); // Debug log
          const universityName = await contracts.universityRegistry.methods.name().call();
          console.log("UniversityRegistry contract is working. Name:", universityName);
        } else {
          console.error("UniversityRegistry contract is undefined.");
        }

        // Check StudentRegistry contract
        if (contracts.studentRegistry) {
          const studentRegistryName = await contracts.studentRegistry.methods.name().call();
          console.log("StudentRegistry contract is working. Name:", studentRegistryName);
        } else {
          console.error("StudentRegistry contract is undefined.");
        }

        // Check Certificates contract
        if (contracts.certificates) {
          const certificatesName = await contracts.certificates.methods.name().call();
          console.log("Certificates contract is working. Name:", certificatesName);
        } else {
          console.error("Certificates contract is undefined.");
        }
      } catch (error) {
        console.error("Error checking contracts:", error);
      }
    };

    checkContracts();
  }, [contracts, account, isLoading]);

  if (isLoading) {
    return <div>Loading contracts and account...</div>;
  }

  if (!contracts || !account) {
    return <div>Contracts or account not loaded.</div>;
  }

  return (
    <div>
      <h1>Check Contracts</h1>
      <p>Open the browser console to see the contract check results.</p>
    </div>
  );
};

export default CheckContracts;