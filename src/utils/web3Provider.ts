import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import config from "../config/config";
import {
  testnetAddresses,
  mainnetAddresses,
} from "@blobfishkate/sovryncontractswip";

/** Testnet and Mainnet are exported separately for use cases like covalent api where only testnet or mainnet is available */
export const web3Testnet = new Web3(config.RSKTestnet);
export const web3Mainnet = new Web3(config.RSKMainnet);

export const web3 = new Web3(
  config.env === "production" ? config.RSKMainnet : config.RSKTestnet
);

export const addresses =
  config.env === "production" ? mainnetAddresses : testnetAddresses;

export const chainId = config.env === "production" ? 30 : 31;

export const createContract = (abi: AbiItem[], address: string): Contract => {
  const contract = new web3.eth.Contract(abi, address.toLowerCase());
  return contract;
};

export default {
  web3: new Web3(
    config.env === "production" ? config.RSKMainnet : config.RSKTestnet
  ),
  contracts: config.env === "production" ? mainnetAddresses : testnetAddresses,
};
