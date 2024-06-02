import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import "@nomicfoundation/hardhat-toolbox";
require("@nomicfoundation/hardhat-chai-matchers");

const { GNOSIS_MNEMONIC } = process.env;

//console.log(process.env);
const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
                runs: 200,
            },
            viaIR: true
        },
    },
    namedAccounts: {
        deployer: 0,
        receiver: 1,
    },
    defaultNetwork: "testnet",
    networks: {
        // View the networks that are pre-configured.
        // If the network you are looking for is not here you can add new network settings
        local_docker: {
            url: `http://172.17.0.2:8545`,
            gasPrice: 10000000000,
            gas: 25e8,
            blockGasLimit: 0x5ffffffffffffffff,
            allowUnlimitedContractSize: true,
        //accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80','0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'],
        },
        testnet: {
            url: "https://testnet.cryptng.xyz:8545",
            //gas:100000000000 ,
            blockGasLimit: 0x1fffffffffffff,
            allowUnlimitedContractSize: true,
            accounts: {
            mnemonic: 'balcony over chase second wrap hospital film tongue recycle credit staff parent',
            path: "m/44'/60'/0'/0",
            initialIndex: 0,
            count: 20,
            passphrase: "",
            },
        },        
        polygon: {
            url: "https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public",
            gasPrice: 5000000000,
            accounts: ["d247bb493620640854d80abaf912803362a8f2d750003a44ab790e8810dfa0a5"]
            
          },
                      
        mantle: {
            url: "https://rpc.sepolia.mantle.xyz",
            gasPrice: 5000000000,
            accounts: ["d247bb493620640854d80abaf912803362a8f2d750003a44ab790e8810dfa0a5"]
          },
          
        linea: {
            url: "https://linea-sepolia.blockpi.network/v1/rpc/public",
            gasPrice: 5000000000,
            accounts: ["d247bb493620640854d80abaf912803362a8f2d750003a44ab790e8810dfa0a5"]
          },

    },
    etherscan: {
        apiKey: {
            polygon: 'XANEY2GZ5XJ7UWT3IQU7NEN1D8TRUW2QRH',
            mantle: 'XANEY2GZ5XJ7UWT3IQU7NEN1D8TRUW2QRH',
            linea: '7QWUGKNC9Z5JVNEXGFHRE4B29QVE8XE9HN',
        },
        customChains: [
            {
                network: 'polygon',
                chainId: 2442,
                urls: {
                    apiURL: 'https://zkevm.polygonscan.com/api',
                    browserURL: 'https://zkevm.polygonscan.com/',
                },
            },
            {
                network: "mantle",
                chainId: 5003,
                urls: {
                apiURL: "https://explorer.sepolia.mantle.xyz/api",
                browserURL: "https://explorer.sepolia.mantle.xyz/"
                }
            },
            {
                network: "linea",
                chainId: 59141,
                urls: {
                  apiURL: "https://api-sepolia.lineascan.build/api",
                  browserURL: "https://sepolia.lineascan.build/",
                },
            },
        ],
    },
};
export default config;