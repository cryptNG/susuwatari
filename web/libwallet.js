function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let LibwalletMobileService = {
    isReady: false,
    isRegistered: false,
    isNewUser: false,
    isLoaded:false,
    curretnState: {},
    oldMessage: '',
    lastMessage: '',
    balance: 0,
    provider: null,
    contract: null,
    connectedWallet: null,
    contractAddress: '',
    contractAbi: '',
    interface: null,
    jsonRpcUrl: '',
    chainId: null,
    
  
    setup(contractAddress, jsonRpcUrl, contractAbi) {
      this.contractAddress = contractAddress;
      this.contractAbi = contractAbi;
      this.interface = new window.ethers.Interface(this.contractAbi);
      try {
        // Set up provider
        if (!window.ethers) {
          throw new Error("Ethers library is not loaded");
        }

        this.provider = new window.ethers.JsonRpcProvider(jsonRpcUrl);
    
        // Set up contract
        this.isReady = true;
      } catch (err) {
        console.error(`Error during setup: ${err}`);
        throw new Error(`Error during setup: ${err}`);
      }
    },
  
    async sendFromFaucet() {
      console.log("sendFaucet")
      const weiAmount = window.ethers.parseEther("0.1");
 
      // Get the signer
      const signer = await this.provider.getSigner();
 
      // Send the transaction
      const tx = await signer.sendTransaction({
        to: this.connectedWallet.address,
        value: weiAmount
      });
 
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      await this.provider.getBalance(signer.address);
 
      console.log(`Transaction ${receipt.transactionHash} mined in block ${receipt.blockNumber}`);
    },

  async aimInitialSusu(tokenId, location, destination, message) {
    try {
      const tx = await this.contract.aimInitialSusu(tokenId, location, destination, message);
      await tx.wait();
      console.log('Transaction completed:', tx);
      return tx;
    } catch (err) {
      console.error('Error aiming initial susu:', err);
      throw err;
    }
  },

  async dropSusu(tokenId, location) {
    try {
      const tx = await this.contract.dropSusu(tokenId, location);
      await tx.wait();
      console.log('Transaction completed:', tx);
      return tx;
    } catch (err) {
      console.error('Error aiming initial susu:', err);
      throw err;
    }
  },

  async makeNewSusu() {
    try {
      const tx = await this.contract.giveSusuwatari();
      await tx.wait();
      console.log('Transaction completed:', tx);
      window.changeState++;
      return tx;
    } catch (err) {
      console.error('Error aiming initial susu:', err);
      throw err;
    }
  },
  
    get isNewSusu() {
      return this.currentState.slot.ownerAddress === this.connectedWallet.address;
    },

    get isCarryingSusu() {
      if(!this.isNewSusu && this.currentState.slot.susuTokenId > 0){
        return true;
      }

      return false;
    },

    get isPickingSusu(){
      return this.currentState.slot.susuTokenId <= 0;
    },

    get address() {
      return this.connectedWallet.address;
    },

    get susuTokenId(){
      return this.currentState.slot.susuTokenId;
    },

    async checkWalletRegistered() {
      let hasChecked = false;      
      while (!hasChecked) {
        if (this.connectedWallet !== null) {
          try {
            // Call the contract function
            this.isRegistered = await this.contract.isSenderRegistered({ from: this.connectedWallet.address });
            hasChecked = true;
          } catch (e) {
            await timeout(2000 );
          }
        } else await timeout(100);
      }
      this.lastMessage = "Wallet register checked";
      return this.isRegistered;
    },
  
  async registerWallet() {
    let txResponse = null;
    let pubKey = this.connectedWallet.signingKey.publicKey;
        let address = window.ethers.computeAddress(pubKey);
        await this.sendFromFaucet();
        let tx = await this.contract.registerAndAssignMe(Math.trunc(Math.random()*100)%2);
        await tx.wait();
        console.log('tx:'+ await tx.wait());
        txResponse = tx;
        this.isRegistered = true;
        this.isNewUser = true;
    return txResponse;
},
  async tryPickupSusu(tokenId) {
    let txResponse = null;
        let tx = await this.contract.tryPickupSusu(tokenId,BigInt(1));
        await tx.wait();
        console.log('tx:'+ await tx.wait());
        txResponse = tx;
        this.isRegistered = true;
        this.isNewUser = true;
    return txResponse;
},

async getCurrentState() {
  let hasChecked = false; 
  console.log('getCurrentState');     
      while (!hasChecked) {
        if (this.connectedWallet !== null) {
          try {
            // Call the contract function

            this.currentState = await this.contract.getCurrentState({ from: this.connectedWallet.address });
            hasChecked = true;
          } catch (e) {
            console.log('getCurrentState error:' + e)
            await timeout(2000);
          }
        } else await timeout(100);
      }
      this.lastMessage = "Wallet state checked";
      return this.currentState;
    },

  
    async createWallet() {
      // Generate new wallet
      const wallet = window.ethers.Wallet.createRandom();
  
      // Convert wallet to JSON and store
      const walletJson = await wallet.encrypt('IMEI');
      await this.saveWallet(walletJson);
      return wallet;
    },
  
    async loadWallet() {
      // Check if the wallet exists in IndexedDB
      const dbRequest = indexedDB.open('LibWalletDB');
      return new Promise((resolve, reject) => {
        dbRequest.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['wallets'], 'readonly');
          const objectStore = transaction.objectStore('wallets');
          const getRequest = objectStore.get('deviceWallet');
          getRequest.onsuccess = async (event) => {
            if (event.target.result) {
              const wallet = await window.ethers.Wallet.fromEncryptedJson(event.target.result, 'IMEI');
              this.connectedWallet = new window.ethers.Wallet(wallet.privateKey, this.provider);
  
              this.contract = new window.ethers.Contract(
                this.contractAddress,
                this.contractAbi,
                this.connectedWallet
              );
              this.isLoaded=true;
              this.getBalance();
              resolve(wallet);
            } else {
              resolve(null);
            }
          };          
          getRequest.onerror = function (event) {
            reject(new Error('Failed to retrieve wallet from database.'));
          };
        };
        dbRequest.onerror = function (event) {
          reject(new Error('Failed to open database.'));
        };
      });
    },
  
    async getNftData(tokenID) {
      return this.contract.getSusstate( tokenID, { from: this.connectedWallet.address });
    },
    async saveWallet(walletJson) {
      // Save the wallet in IndexedDB
      const dbRequest = indexedDB.open('LibWalletDB');
      return new Promise((resolve, reject) => {
        dbRequest.onupgradeneeded = function (event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('wallets')) {
            db.createObjectStore('wallets');
          }
        };
        dbRequest.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction(['wallets'], 'readwrite');
          const objectStore = transaction.objectStore('wallets');
          const putRequest = objectStore.put(walletJson, 'deviceWallet');
          putRequest.onsuccess = function (event) {
            resolve();
          };
          putRequest.onerror = function (event) {
            reject(new Error('Failed to store wallet in database.'));
          };
        };
        dbRequest.onerror = function (event) {
          reject(new Error('Failed to open database.'));
        };
      });
    },
  
    async checkWalletExists() {
      const dbRequest = indexedDB.open('LibWalletDB');
      return new Promise((resolve, reject) => {
        dbRequest.onupgradeneeded = (event) => {
          // Save the IDBDatabase interface
          const db = event.target.result;
        
          // Create an objectStore for this database
          if (!db.objectStoreNames.contains('wallets')) {
            db.createObjectStore('wallets');
          }
        };
        dbRequest.onsuccess = function (event) {
          const db = event.target.result;
          
          const transaction = db.transaction(['wallets'], 'readonly');
          const objectStore = transaction.objectStore('wallets');
          const getRequest = objectStore.get('deviceWallet');
          getRequest.onsuccess = function (event) {
            if (event.target.result) {
              resolve(true);
            } else {
              resolve(false);
            }
          };
          getRequest.onerror = function (event) {
            reject(new Error('Failed to check if wallet exists.'));
          };
        };
        dbRequest.onerror = function (event) {
          reject(new Error('Failed to open database.'));
        };
      });
    },
  
    async trackBalance(timeMillis) {
      setInterval(async () => {
        await this.getBalance();
      }, timeMillis);
    },
  
    deviceWalletBalance: 0,
  
    async getBalance() {
      return this.deviceWalletBalance = await this.provider.getBalance(this.connectedWallet.address) / BigInt(10 ** 18);
    },
  
    async getAllSusuwataris() {
      try {
          if (!this.contract) {
              throw new Error("Contract is not set up. Please set up the contract first.");
          }
          // Call the contract method
          const susuwataris = await this.contract.getAllSusuwataris();
          return susuwataris;
      } catch (err) {
          console.error('Error fetching Susuwataris:', err);
          throw err;
      }
  },

    async assignData(message) {
      let success = false;
  
      try {
        this.lastMessage = "storing data ...";
        let tx = await this.contract.assignData(message, { from: this.connectedWallet.address });
        console.log('tx:' + await tx.wait());
        this.lastMessage = "Message stored to blockchain";
        success = true;
      } catch (exc) {
        this.lastMessage = exc.message;
        rethrow(exc);
      } finally {
        this.contract.removeAllListeners();
      }
      this.getBalance();
      return success;
    }
  };

  

  window.LibwalletMobileService = LibwalletMobileService;
  