<template>
  <div class="container">
    <div class="top-right-buttons">
      <button v-if="!isConnected" id="connectWallet" class="connect-button" @click="enableEthereum">Connect wallet</button>
      <button v-else id="disconnectWallet" class="disconnect-button" @click="disconnectWallet">Disconnect wallet</button>
    </div>
    <div class="account">
      <h2 class="mb-3">Account: <span id="currentAccount"></span></h2>
      <span v-if="currentAccount">{{ currentAccount }}</span>
      <br>
      <span v-if="currentAccount">Balance NFT: {{ currentNftBalance }}</span>
    </div>
    <div class="main-container">
      <div class="menu">
        <button @click="tab = 'commit'" :class="{ active: tab === 'commit' }">Commit</button>
        <button @click="tab = 'deploy'" :class="{ active: tab === 'deploy' }">Deploy</button>
        <button @click="tab = 'safe'" :class="{ active: tab === 'safe' }">Safe</button>
      </div>
      
      <div v-if="tab==='commit'" class="form-container">
        <form id="sendCommit" class="mb-5" @submit.prevent="sendCommit">
          <h2 class="mb-3">Commit & Mint</h2>
            <div class="form-group">
            <label for="Salt">Salt:</label>
            <input type="text" class="form-control" id="salt">
            </div>
            <button :disabled="!currentAccount" type="submit" class="btn btn-primary">Commit & Mint</button>
        </form>
      </div>

      <div v-else-if="tab==='deploy'" class="form-container">
        <form id="deploy" @submit.prevent="deploy">
          <h2 class="mb-3">Deploy</h2>
            <div class="form-group">
            <label for="saltHash">saltHash:</label>
            <input type="text" class="form-control" id="saltHashDeploy">
            <label for="byteCode">byteCode:</label>
            <input type="text" class="form-control" id="byteCodeDeploy">
            </div>
            <button type="submit" class="btn btn-primary">Deploy contract</button>
        </form>
      </div>
      <div v-else-if="tab==='safe'" class="form-container">
        <form>
          <h2 class="mb-3">Additional Inputs</h2>
          <div class="form-group" v-for="(input, index) in inputs" :key="index">
          <label :for="'input'+index">Input {{ index + 1 }}:</label>
          <input type="text" class="form-control" :id="'input'+index" v-model="inputs[index]">
          </div>
          <button type="button" class="btn btn-primary mb-2" @click="addInput">+</button>
          <label :for="'input'+index">Threshold:</label>
          <input type="text" class="form-control" :id="threshold" v-model="threshold">
        </form>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import detectEthereumProvider from '@metamask/detect-provider';
  import { ethers} from 'ethers';
  import abi from "@/ABI/addressOptions";
  
  export default {
    setup() {
      const currentAccount = ref(null);
      let currentNftBalance = ref(0)
      const salt = ref('');
      let saltHashDeploy = ref('');
      let byteCodeDeploy = ref('')
      const isConnected = ref(false);
      const inputs = ref(['']);
      const tab = ref('commit')

      const addInput = () => {
        inputs.value.push(''); // add new input to the array
      };

      const getNftBalance = async (currentAddress) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractAddress = '0xf20aca635cc4efcd5709cc1e78db4476a075db1b';
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const metaUri = await contract.balanceOf(currentAddress);
        return metaUri
      }
  
      const enableEthereum = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (accounts[0] !== currentAccount.value ) {
            currentAccount.value = accounts[0];
            isConnected.value = true;
          }
        } catch (err) {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        }
        currentNftBalance.value = await getNftBalance(currentAccount.value)
        console.log('currentAccount.value', currentAccount.value)
        console.log('isConnected.value', isConnected.value)
      };

      const sendCommit = async() =>{

        console.log('alskdnalskn')
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0xf20aca635cc4efcd5709cc1e78db4476a075db1b';
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const saltHex = ethers.utils.hexlify(parseInt(salt.value));
            const saltHash = ethers.utils.keccak256(ethers.utils.hexZeroPad(saltHex, 32));
            try {
                const transactionResponse = await contract.commit(saltHash, {
                gasLimit: ethers.utils.hexlify(100000)
                });

                console.log(transactionResponse);
                mint(contract, ethers.utils.hexZeroPad(saltHex, 32))
            } catch (error) {
                console.error('Error occurred: ', error);
            }
          } else {
              console.log('Please install MetaMask!');
          }
      }

      const mint = async(contract, saltBytes32) =>{
        try {
            const transactionResponse = await contract.mint(saltBytes32, {
            gasLimit: ethers.utils.hexlify(200000)
            });

            console.log(transactionResponse);
        } catch (error) {
            console.error('Error occurred: ', error);
        }
      }

      const deploy = async() =>{
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = '0xf20aca635cc4efcd5709cc1e78db4476a075db1b';
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const saltHash = saltHashDeploy.value;
            const byteCode = byteCodeDeploy.value;
            try {
                const transactionResponse = await contract.deploy(saltHash, byteCode, {
                    gasLimit: ethers.utils.hexlify(300000)
                });

                console.log(transactionResponse);
            } catch (error) {
                console.error('Error occurred: ', error);
            }
            } else {
                console.log('Please install MetaMask!');
            }
      }
  
      const disconnectWallet = async () => {
          currentAccount.value = null;
          isConnected.value = false;
          console.log('currentAccount.value', currentAccount.value)
          console.log('isConnected.value', isConnected.value)
      };
  
      onMounted(async () => {
        const provider = await detectEthereumProvider();
  
        if (provider) {
          if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
          } else {
            window.ethereum.on('chainChanged', () => window.location.reload());
            window.ethereum.on('accountsChanged', enableEthereum);
          }
        } else {
          console.log('Please install MetaMask!');
        }
      });
  
      return {
        currentNftBalance,
        tab, 
        addInput,
        inputs,
        currentAccount,
        enableEthereum,
        salt,
        deploy,
        sendCommit,
        saltHashDeploy,
        isConnected,
        disconnectWallet
      };
    }
  }
</script>
<style>
    body {
      font-family: Arial, sans-serif;
      background-color: #F0F0F0;
      padding: 20px;
    }
    form {
      background-color: white;
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    button {
      background-color: #007BFF;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      padding: 10px 20px;
    }
    button:hover {
      background-color: #0056b3;
    }
    label {
      display: block;
      margin-bottom: 10px;
    }
    input {
      width: 90%;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #CCC;
      margin-bottom: 20px;
    }
    .container {
      display: flex;
      justify-content: center;
    }
    .account{
      margin-bottom: 20px;
      font-size: large;
    }
    .background {
      width: 50%;
      background-color: lightgray;
      padding: 20px;
    }

    .menu {
      display: flex;
      justify-content: space-between;
    }

    .menu button {
      width: 34%;
      padding: 10px 20px;
      background-color: #c8c8d3;
      border: 1px solid #afadad;
      border-radius: 0px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .menu button:hover {
      background-color: #afc5e4;
    }

    .menu .active {
      background-color: #007bff;
      color: white;
    }


    .top-right-buttons {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
    }

    .connect-button,
    .disconnect-button {
      margin: 20px;
    }
</style>
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .main-container{
    max-width: 50%;
    width: 100%;
  }

  .form-container {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .form-container {
      max-width: 100%;
    }
  }
</style>
  