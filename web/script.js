document.addEventListener("DOMContentLoaded", async ()=> {
    const createWalletBtn = document.getElementById('createWalletBtn');
    const loadWalletBtn = document.getElementById('loadWalletBtn');

    LibwalletMobileService.setup();

    while(!LibwalletMobileService.isReady){
        await timeout(100)
        console.log('Waiting for LibwalletMobileService to be ready...')
    }
  
    createWalletBtn.addEventListener('click', async () => {
      try {
        const wallet = await LibwalletMobileService.createWallet();
        console.log('New wallet created:', wallet);
      } catch (error) {
        console.error('Error creating wallet:', error);
      }
    });
  
    loadWalletBtn.addEventListener('click', async () => {
      try {
        const wallet = await LibwalletMobileService.loadWallet();
        if (wallet) {
          console.log('Wallet loaded:', wallet);
        } else {
          console.log('No wallet found.');
        }
      } catch (error) {
        console.error('Error loading wallet:', error);
      }
    });
  });
  