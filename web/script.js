document.addEventListener("DOMContentLoaded", async ()=> {

  document.querySelector('nav .game').addEventListener('click',(e)=>{

      document.querySelectorAll('.pane').forEach((pane)=> {
      pane.classList.remove('active');
      } );
    document.querySelectorAll('nav span').forEach((menu)=> {
      menu.classList.remove('active');
     } );  

    document.querySelector('#game-pane').classList.add('active');
    document.querySelector('nav .game').classList.add('active');


}, false);

document.querySelector('.aim-button').addEventListener('click', async () => {
  try {
    const tokenId = LibwalletMobileService.currentState.slot.susuTokenId;

    // Get the user's current position and selected position
    const { center, userLatLng } = await selectedPosition();
 
    // Calculate spot IDs for both locations
    const location = encodeCoordinates({lat:userLatLng[0],lon:userLatLng[1]});
    const destination = encodeCoordinates({lat:center.lat,lon:center.lng});
    const message = "message";

    console.log("Test" + userLatLng, center);
    console.log("aiming susu");
    const tx = await LibwalletMobileService.aimInitialSusu(tokenId, location, destination, message);
    window.changeState++;
    console.log("POW susu shot");
  } catch (err) {
    console.log("Susu missed...");
    console.log(err);

  }
  window.changeState++;
},false);

    const messagesDiv = document.getElementById('messages');
    const messagesGameDiv = document.getElementById('gameMessages');

  
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
    const contractAbi =[
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractOwner",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "facetAddress",
                "type": "address"
              },
              {
                "internalType": "enum IDiamondCut.FacetCutAction",
                "name": "action",
                "type": "uint8"
              },
              {
                "internalType": "bytes4[]",
                "name": "functionSelectors",
                "type": "bytes4[]"
              }
            ],
            "internalType": "struct IDiamondCut.FacetCut[]",
            "name": "_diamondCut",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "initContract",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "initData",
                "type": "bytes"
              }
            ],
            "internalType": "struct Diamond.Initialization[]",
            "name": "_initializations",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      },
      {
        "inputs": [],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "originLocation",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "currentLocation",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "destination",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint8",
            "name": "team",
            "type": "uint8"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "message",
            "type": "string"
          }
        ],
        "name": "DroppedSusu",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "message",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint8",
            "name": "team",
            "type": "uint8"
          }
        ],
        "name": "MintedSusu",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "location",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "message",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint8",
            "name": "team",
            "type": "uint8"
          }
        ],
        "name": "PickedUpSusu",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "location",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "destination",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "message",
            "type": "string"
          }
        ],
        "name": "aimInitialSusu",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "location",
            "type": "uint256"
          }
        ],
        "name": "dropSusu",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllSusuwataris",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              }
            ],
            "internalType": "struct LibSusuwatari.SusuwatariInfo[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getBaggedSusus",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "carrier",
                "type": "address"
              }
            ],
            "internalType": "struct LibSusuwatari.BaggedSusuInfo[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCurrentState",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256[]",
                "name": "ownedTokens",
                "type": "uint256[]"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "susuTokenId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "dropCooldownTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "ownerAddress",
                    "type": "address"
                  }
                ],
                "internalType": "struct BaggageSlot",
                "name": "slot",
                "type": "tuple"
              },
              {
                "internalType": "uint8",
                "name": "team",
                "type": "uint8"
              }
            ],
            "internalType": "struct UserState",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "giveSusuwatari",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint8",
            "name": "team",
            "type": "uint8"
          }
        ],
        "name": "registerMe",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "location",
            "type": "uint256"
          }
        ],
        "name": "tryPickupSusu",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
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
      },
      {
        "inputs": [
          {
            "internalType": "uint8",
            "name": "team",
            "type": "uint8"
          }
        ],
        "name": "registerAndAssignMe",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "facetAddress",
                "type": "address"
              },
              {
                "internalType": "enum IDiamondCut.FacetCutAction",
                "name": "action",
                "type": "uint8"
              },
              {
                "internalType": "bytes4[]",
                "name": "functionSelectors",
                "type": "bytes4[]"
              }
            ],
            "indexed": false,
            "internalType": "struct IDiamondCut.FacetCut[]",
            "name": "_diamondCut",
            "type": "tuple[]"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "_init",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_calldata",
            "type": "bytes"
          }
        ],
        "name": "DiamondCut",
        "type": "event"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "facetAddress",
                "type": "address"
              },
              {
                "internalType": "enum IDiamondCut.FacetCutAction",
                "name": "action",
                "type": "uint8"
              },
              {
                "internalType": "bytes4[]",
                "name": "functionSelectors",
                "type": "bytes4[]"
              }
            ],
            "internalType": "struct IDiamondCut.FacetCut[]",
            "name": "_diamondCut",
            "type": "tuple[]"
          },
          {
            "internalType": "address",
            "name": "_init",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "_calldata",
            "type": "bytes"
          }
        ],
        "name": "diamondCut",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "owner_",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "_functionSelector",
            "type": "bytes4"
          }
        ],
        "name": "facetAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "facetAddress_",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "facetAddresses",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "facetAddresses_",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_facet",
            "type": "address"
          }
        ],
        "name": "facetFunctionSelectors",
        "outputs": [
          {
            "internalType": "bytes4[]",
            "name": "facetFunctionSelectors_",
            "type": "bytes4[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "facets",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "facetAddress",
                "type": "address"
              },
              {
                "internalType": "bytes4[]",
                "name": "functionSelectors",
                "type": "bytes4[]"
              }
            ],
            "internalType": "struct IDiamondLoupe.Facet[]",
            "name": "facets_",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "_interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
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
    ];
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
    window.refresh=true;
    window.changeState=0;
    window.dontPan=false;
    async function loadGame(){
      let lastChangeState = -1;
      while(window.refresh===true){
      while(lastChangeState === window.changeState){
        await timeout(100);
      }
      document.querySelector('#game-pane').classList.remove('drop-susu');
      document.querySelector('#game-pane').classList.remove('pick-susu');
      document.querySelector('#game-pane').classList.remove('carry-susu');

      window.allSusuwataris = await LibwalletMobileService.getAllSusuwataris();

      if(map) map.off('moveend', updateCachePositions);

    lastChangeState = window.changeState;
    await LibwalletMobileService.getCurrentState();
    console.log('Current State:', LibwalletMobileService.currentState);

    updatePositionPeriodically();

    if(LibwalletMobileService.isNewSusu) {
      document.querySelector('#game-pane').classList.add('drop-susu');
      const BigIntAddress = BigInt(LibwalletMobileService.address);
      const uniqueIconSeed = xorExtendedBigInt( BigIntAddress , BigInt(LibwalletMobileService.currentState.slot.susuTokenId));
      let hexSeed = uniqueIconSeed.toString(16);
      const iconGenerator = new Icon(hexSeed, document.querySelector('.newSusu svg'));
      iconGenerator.generateIcon();
      await displayGameMessage("You've found a new Susuwatari!");
      await timeout(1500);
      await moveGameMessage();
      await timeout(2500);
     
      await displayGameMessage("Please choose its destination!");
      document.querySelector('.aim-button').style.display = 'block';
      

      map.on('move', async () => {
        window.dontPan=true;
        try {
          const { points } = await selectedPosition();
          deleteAndType = false; // Switch to normal text displayer
          await displayGameMessage(`Potential points: ${points}`);
          deleteAndType = true; // Switch back to delete and type mode
        } catch (error) {
          console.error("Error:", error);
          // Handle error
        }
      });

    }

    if(LibwalletMobileService.isCarryingSusu){
      document.querySelector('#game-pane').classList.add('carry-susu');
      console.log("statenew")
      await timeout(1500);
      await moveGameMessage();
      await displayGameMessage("You are carrying a Susuwatari. Yay!!!");
      await timeout(1000);
      await moveGameMessage();
      await displayGameMessage("Bring it nearer to it's destination to earn Fame Coins.");
      
      updateDropPosition();
    }

    if(LibwalletMobileService.isPickingSusu){
      document.querySelector('#game-pane').classList.add('pick-susu');
      console.log("startpick")
      await displayGameMessage("It seems like your Slot is empty...");
      await timeout(1500);
      await moveGameMessage();
      await displayGameMessage("Let's find you a new Susuwatari!");
     

      try {
   
        updatePositionEvent(LeaderBoard.susus);

        updateCachePositions(LeaderBoard.susus,showCaches.bind(this));

        tryPickSusu();

    } catch (err) {
        console.error('Error fetching Susuwataris:', err);
    }

   
    map.on('moveend', () => {
        window.requestAnimationFrame(()=>{
          updateCachePositions(LeaderBoard.susus,showCaches.bind(this));
        });
      });

      
      map.on('zoomstart', hideCaches.bind(this));

      map.on('zoomend', () => {
        window.requestAnimationFrame(() => {
            updateCachePositions(LeaderBoard.susus,showCaches.bind(this));
        });
    });
    }



    document.querySelector('#game-pane').classList.add('show-map');


  }
}
    
       
loadGame();
initMap();
panToUserLocation();
});

showCaches=()=> {
  let caches = document.querySelectorAll('.inmap-cache');
  caches.forEach(cache => {
    cache.classList.remove('hidden');
    cache.classList.remove('animate-fade-in'); // Remove the animation class
    
    // Force a reflow. This is synchronous and will cause a layout
    void cache.offsetWidth;

    cache.classList.add('animate-fade-in'); // Re-add the animation class
  });
}

hideCaches=() =>{
  let caches = document.querySelectorAll('.inmap-cache');
  caches.forEach(cache => {
    cache.classList.add('hidden');
  });
}

async function tryPickSusu(){
  while(window.refresh && LibwalletMobileService.isPickingSusu){
    for(let i=0;i<LeaderBoard.susus.length;i++){
      if(LeaderBoard.susus[i].currentSpotId === userSpotId && LeaderBoard.susus[i].ownerAddress !== LibwalletMobileService.address){
        console.log('try pick susu:'+LeaderBoard.susus[i].tokenId);
        await LibwalletMobileService.tryPickupSusu(LeaderBoard.susus[i].tokenId);
        window.changeState++;
        await timeout(1000);
        break;
      }
      
    }
    await timeout(100);
  }
}
async function updateDropPosition(){
  updatePositionEvent(LeaderBoard.susus);
  while(window.refresh && LibwalletMobileService.isCarryingSusu){
    panToUserLocation();
    
    const susus = LeaderBoard.susus;
    susus.find((susu)=>susu.tokenId===LibwalletMobileService.currentState.slot.susuTokenId).posCurrent={lat:userPosition[0],lon:userPosition[1]};
    updateCachePositions(susus);
    await timeout(100);
  }
}
