const Certificates = artifacts.require("Degrees");

module.exports = async function (deployer, network, accounts) {
  // Deploy UniversityRegistryy contract
  // Deploy Certificates contract
  await deployer.deploy(Certificates);
  const certificates = await Certificates.deployed();

  // Log contract addresses
  console.log("Certificates deployed at:", certificates.address);
};