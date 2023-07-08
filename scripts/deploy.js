const hre = require("hardhat");
const ethers = require("ethers");
const fs = require('fs');

const { getContractAddress, getCreate2Address } = require('@ethersproject/address')

async function getFactoryContract(name, address) {
  const FactoryContract = await hre.ethers.getContractFactory(name);
  const factoryContract = FactoryContract.attach(address);
  return factoryContract;
}

function create2Address(factoryAddress, saltHex, initCode){
  const create2Addr = ethers.utils.getCreate2Address(factoryAddress, saltHex, ethers.utils.keccak256(initCode));
  return create2Addr;

}

function countMatchingChars(address) {
  let i = 0;

  if (address.length > 0) {
    while (i < address.length && address[i] === address[0]) {
        i++;
    }
}

  return i;
}

function calculateContractAddress(FactoryContract, IntermediateFactory, AccountAbstration) {
  const FactoryContractAddress = FactoryContract.address
  const IntermediateFactoryBytecode = IntermediateFactory.bytecode
  const AccountAbstrationBytecode = AccountAbstration.bytecode

  const initCode = ethers.utils.solidityPack(["bytes", "bytes"], [IntermediateFactoryBytecode,  ethers.utils.defaultAbiCoder.encode(["bytes"], [AccountAbstrationBytecode])]);

  let saltHex = 0
  const nonce = 1; 
  let futureAccountAbstractionAddress = ''
  let countChars = 0
  const limit = 6
  let currentMaxChars = 0

  for (salt=770000; salt<10000000; salt++){

    if (salt%10000 == 0){
      console.log('Salt', salt)
    }

    saltHex = ethers.utils.hexZeroPad(salt, 32);
    const futureIntemediateFactoryAddress = create2Address(FactoryContractAddress, saltHex, initCode);


    futureAccountAbstractionAddress = getContractAddress({
      from: futureIntemediateFactoryAddress,
      nonce: nonce
    })
    countChars = countMatchingChars(futureAccountAbstractionAddress.slice(2).toLowerCase()) 

    if (countChars > currentMaxChars){
      currentMaxChars = countChars
      console.log('currentMaxChars', currentMaxChars)
      console.log('futureAccountAbstractionAddress', futureAccountAbstractionAddress)
    }

    if (countChars >= limit){
      return salt
    }
  }
  return 0
}


async function main() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

  const accounts = await provider.listAccounts();

  const deployer = provider.getSigner(accounts[0]);

  const IntermediateFactory = await hre.ethers.getContractFactory("DeployerCreate", deployer);
  const AccountAbstration = await hre.ethers.getContractFactory("SimpleStorage", deployer);

  const mainFactoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const factoryAbi = JSON.parse(fs.readFileSync('./scripts/FactoryABI.json', 'utf8'));

  const FactoryContract = new ethers.Contract(mainFactoryAddress, factoryAbi, deployer);

  const IntermediateFactor = await hre.ethers.getContractFactory("DeployerCreate2", deployer);
  const IntermediateFacto = await IntermediateFactor.deploy();
  
  await IntermediateFacto.deployed();

  console.log(IntermediateFacto.address)

  const salt = calculateContractAddress(FactoryContract, IntermediateFactory, AccountAbstration)

  if (salt == 0){
    return 0
  }

  // console.log(await FactoryContract.functions.checkStatus())


  const tx = await FactoryContract.deploy(IntermediateFactory.bytecode, ethers.utils.hexZeroPad(ethers.BigNumber.from(salt).toHexString(), 32), AccountAbstration.bytecode);

  const receipt = await tx.wait(); // Wait for the transaction to be mined


  console.log(tx)
  console.log(receipt)

  // Get the event from the transaction receipt
  const event = receipt.events.find(e => e.event === "Deployed");

  if (event) {
    const simpleStorageAddress = await '0x' + receipt.events[0].data.slice(26)
    const createAddress = event.args.addr

    console.log('Real address ', simpleStorageAddress)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
