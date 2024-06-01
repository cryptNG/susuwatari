import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {ethers} from 'hardhat';

var date = new Date();

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */

const deploySusuwatari: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const isTesting =['local_docker','testnet','localhost'].includes( hre.network.name);
  const { deployer } = await hre.getNamedAccounts();
  const [owner,address1,address2] = await ethers.getSigners();
  const { diamond } = hre.deployments;

  await diamond.deploy("Susuwatari", {
    from: owner.address,
    autoMine: true,
    log: true,
    waitConfirmations: 1,
    facets: [{
      deterministic:false,
      name:"InitFacet"
    },
    {
      deterministic:false,
      name:"SusuwatariFacet"},
    //{
    //   deterministic:false,
    //   name:"SusuwatariLeafWalletFacet"},
      
        
    ],
    // facets: [
    //   "InitFacet",
    //   "SusuwatariFacet",
    //   "ManageSusuwatariFacet",
    //   "SusuwatariLeafWalletTrialFacet",
    // ],
    execute: {
      contract: 'InitFacet',
      methodName: 'init',
      args: []
    },
  })
};

export default deploySusuwatari;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deploySusuwatari.tags = ["Susuwatari"];
