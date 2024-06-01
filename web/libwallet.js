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
  
    get isNewSusu() {
      return this.currentState.slot.ownerAddress === this.connectedWallet.address;
    },

    get adress() {
      return this.connectedWallet.address;
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
        let tx = await this.contract.registerAndAssignMe(Math.trunc(Math.random()*100)%2);
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
  