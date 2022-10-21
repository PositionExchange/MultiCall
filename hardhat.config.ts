import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();


export async function verifyContract(
    hre : any,
    address : string,
    args : undefined,
    contract : string | undefined
) {
  const verifyObj = { address } as any;
  if (args) {
    verifyObj.constructorArguments = args;
  }
  if (contract) {
    verifyObj.contract = contract;
  }
  return hre
      .run("verify:verify", verifyObj)
      .then(() => console.log("Contract address verified:", address))
      .catch((err : any) => {
        console.log(`Verify Error`, err);
      });
}

task("deploy-MultiCall", "Deploy MultiCall", async (taskArgs, hre) => {


  const normal = await hre.ethers.getContractFactory("MultiCall3");
  const deployTx = await normal.deploy();

  await deployTx.deployTransaction.wait(5);

  console.log("MultiCall3: ", deployTx.address);

  await verifyContract(
      hre,
      deployTx.address,
      undefined,
      "contracts/Multicall3.sol:Multicall3");
});

const config: HardhatUserConfig = {
  solidity: "0.8.14",
  networks: {
    posichaintestnet: {
      url: "http://api.s0.t.posichain.org",
      chainId: 910000,
      accounts: []
    },
    posichaindevnet: {
      url: "http://api.s0.d.posichain.org",
      chainId: 920000,
      accounts: [ ]
    },
    posichainmainnet: {
      url: "https://api.posichain.org/",
      chainId: 900000,
      accounts: [ ]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.API_KEY,
    customChains: [
      {
        network: "posichaintestnet",
        chainId: 910000,
        urls: {
          apiURL: "https://apex-testnet.posichain.org/contract-verifier/verify",
          browserURL: "https://explorer-testnet.posichain.org/"
        }
      },
      {
        network: "posichaindevnet",
        chainId: 920000,
        urls: {
          apiURL: "https://apex-devnet.posichain.org/contract-verifier/verify",
          browserURL: "http://explorer-qc.nonprodposi.com/"
        }
      },
      {
        network: "posichainmainnet",
        chainId: 900000,
        urls: {
          apiURL: "https://apex.posichain.org/contract-verifier/verify",
          browserURL: "https://explorer.posichain.org/"
        }
      },

    ]
  },
  typechain: {
    outDir: "typeChain",
    target: "ethers-v5",
  },
};

export default config;







