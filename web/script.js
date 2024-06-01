document.addEventListener("DOMContentLoaded", async ()=> {

  document.querySelector('nav .game').addEventListener('click',(e)=>{

    document.querySelectorAll('.pane').forEach((pane)=> {
     pane.classList.remove('active');
    } );
     document.querySelector('#game-pane').classList.add('active');
 },false);

    const messagesDiv = document.getElementById('messages');
    const messagesGameDiv = document.getElementById('gameMessages');
    const messagesChooseLocationDiv = document.getElementById('locationMessages');

  
    function displayMessage(message) {
      messagesDiv.textContent = message;
    }

    let deleteAndType = true;

    async function displayGameMessage(message) {
        if (deleteAndType) {
            const currentMessage = messagesGameDiv.textContent;
            for (let i = currentMessage.length; i >= 0; i--) {
                messagesGameDiv.textContent = currentMessage.substring(0, i);
                await new Promise(resolve => setTimeout(resolve, 30)); 
            }
    
            // Type new message one letter at a time
            for (let i = 0; i <= message.length; i++) {
                messagesGameDiv.textContent = message.substring(0, i);
                await new Promise(resolve => setTimeout(resolve, 30));
            }
        } else {
            messagesGameDiv.textContent = message;
        }
    }



    function displayChooseLocation(message) {
      messagesChooseLocationDiv.textContent = message;
    }

    async function setLoaderComplete() {
      loader.style.borderColor = '#4CAF50';
      loader.style.borderTopColor = '#4CAF50';
      displayMessage('Welcome!');
      await timeout(2000);
      document.querySelector('.flip-card').classList.add('active');
  }

  function moveGameMessage() {
    return new Promise(resolve => {
        setTimeout(() => {
            document.querySelector('.newSusu').classList.add('move-up');
            document.querySelector('.gameMessages').classList.add('move-up');
            document.querySelector('.gameMessagesWrapper').classList.add('move-up');
            resolve();
        }, 4500);
    });
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
      await LibwalletMobileService.registerWallet();
    }
    displayMessage('Wallet registration complete!');

    setLoaderComplete();
    //displayChooseLocation("Please choose where to drop your Susuwari");

    await LibwalletMobileService.getCurrentState();
    console.log('Current State:', LibwalletMobileService.currentState);

    if(LibwalletMobileService.isNewSusu) {
      const BigIntAdress = BigInt(LibwalletMobileService.adress);
      const uniqueIconSeed = BigIntAdress ^ BigInt(LibwalletMobileService.currentState.slot.susuTokenId);
      let hexSeed = uniqueIconSeed.toString(16);
      const iconGenerator = new Icon(hexSeed, document.querySelector('.newSusu svg'));
      iconGenerator.generateIcon();
    }
    await displayGameMessage("You've found a new Susuwatari!");
    await timeout(1500);
    await moveGameMessage();
    await timeout(2500);
    initMap();
    panToUserLocation();
    await displayGameMessage("Please choose its destination!");

    map.on('move', async () => {
      try {
        const points = await selectedPosition();
          deleteAndType = false; // Switch to normal text displayer
          await displayGameMessage(`Potential points: ${points}`);
          deleteAndType = true; // Switch back to delete and type mode
      } catch (error) {
          console.error("Error:", error);
          // Handle error
      }
  });
});