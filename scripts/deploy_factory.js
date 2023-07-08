const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
  
    const accounts = await provider.listAccounts();
  
    const deployer = provider.getSigner(accounts[0]);
  
    const DeployerCreate2 = await hre.ethers.getContractFactory("DeployerCreate2", deployer);
    const deployerCreate2 = await DeployerCreate2.deploy();
  
    await deployerCreate2.deployed();
  
    console.log("Factory deployed to:", deployerCreate2.address);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
  