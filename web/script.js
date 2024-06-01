document.addEventListener("DOMContentLoaded", async ()=> {
    const messagesDiv = document.getElementById('messages');
    const messagesGameDiv = document.getElementById('gameMessages');
    const messagesNewUserDiv = document.getElementById('gameMessages');

  
    function displayMessage(message) {
      messagesDiv.textContent = message;
    }

    function displayGameMessage(message) {
      messagesGameDiv.textContent = message;
    }

    async function setLoaderComplete() {
      loader.style.borderColor = '#4CAF50';
      loader.style.borderTopColor = '#4CAF50';
      displayMessage('Welcome!');
      await timeout(2000);
      document.querySelector('.flip-card').classList.add('active');
    }
  

    const contractAddress = '0xbc62d21a50930b689cd56b31A82d2c882105F04c';
    const jsonRpcUrl = 'https://testnet.cryptng.xyz:8545';
    const contractAbi = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "AssignActivatableAddressToSenderReturn",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "assignee",
            "type": "address"
          }
        ],
        "name": "assignActivatableAddressToSender",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getActivationCodeOfSender",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getDeviceOwner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getRelatedDevices",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isSenderRegistered",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]  
    displayMessage('Setting up Wallet Service...');

    console.log('Setting up LibwalletMobileService...')
    LibwalletMobileService.setup(contractAddress, jsonRpcUrl, contractAbi);
    displayMessage('Setup complete.');
    displayMessage('Checking wallet existence...');
  
    if (!await LibwalletMobileService.checkWalletExists()) {
      displayMessage('Creating wallet...');
      await LibwalletMobileService.createWallet();
      displayMessage('Wallet created.');
    }
  
    displayMessage('Loading wallet...');
    const wallet = await LibwalletMobileService.loadWallet();
    displayMessage('Wallet loaded: ' + JSON.stringify(wallet));
    console.log('Wallet loaded: ' + JSON.stringify(wallet));
  
    displayMessage('Checking wallet registry...');
    if (!await LibwalletMobileService.checkWalletRegistered()) {
      displayMessage('Registering wallet...');
      displayNewUserMessage("Welcome to Susuwatari! Please choose a Team!");

      await LibwalletMobileService.registerWallet();
    }
    displayMessage('Wallet registration complete!');

    setLoaderComplete();

    await LibwalletMobileService.getCurrentState();
    console.log('Current State:', LibwalletMobileService.currentState);

    if(LibwalletMobileService.isNewSusu) {
      const BigIntAdress = BigInt(LibwalletMobileService.adress);
      const uniqueIconSeed = BigIntAdress ^ BigInt(LibwalletMobileService.currentState.slot.susuTokenId);
      let hexSeed = uniqueIconSeed.toString(16);
      const iconGenerator = new Icon(hexSeed, document.querySelector('.newSusu svg'));
      iconGenerator.generateIcon();
      displayGameMessage("You've found a new Susuwatari! You can now choose it's destination.");

    }
});