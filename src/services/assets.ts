/**
 * 1. Get all assets in the system
 * 2. For all assets that are not "exceptions", read totalSupply from contract
 * 3. Separate methods for RBTC, FISH, SOV
 */

/**
 *         "symbol": "SOV",
        "name": "Sovryn Token",
        "id": "0xefc78fc7d48b64958315949279ba181c2114abbd",
        "trading_fee": 0.0015,
        "unified_cryptoasset_id": 8669,
        "circulating_supply": 21365209.8256,
        "updated": "2022-04-08T11:20:30.000Z"
 */

import { getQuery } from "../utils/apolloClient";
import { assetDataQuery } from "../graphQueries/priceAndVolume";
import { abiErc20 } from "@blobfishkate/sovryncontractswip";
import { addresses, createContract, web3 } from "../utils/web3Provider";
import { bignumber } from "mathjs";
import { fishReleaseSchedule } from "../utils/fishCircSupply";

async function getGraphAssetData() {
  const data = await getQuery(assetDataQuery);
  for (const item of data.protocolStats.tokens) {
    const circSupply = await getCirculatingSupply(item.symbol, item.id);
    console.log(circSupply, item.symbol);
  }
}

const circulatingSupplySpecial: { [key: string]: () => Promise<string> } = {
  SOV: getSovCircSupply,
  WRBTC: getWrbctcCircSupply,
  FISH: getFishCircSupply,
};

async function getSovCircSupply() {
  // const sovContract = createContract(
  //   abiErc20,
  //   addresses.SOV_token.toLowerCase()
  // );
  // const stakingBalance: string = await sovContract.methods
  //   .balanceOf(addresses.staking.toLowerCase())
  //   .call();
  // const adoptionBalance: string = await sovContract.methods
  //   .balanceOf(addresses.AdoptionFund.toLowerCase())
  //   .call();
  // const developmentBalance: string = await sovContract.methods
  //   .balanceOf(addresses.DevelopmentFund.toLowerCase())
  //   .call();

  const circSupply = bignumber("100000000000000000000000000").minus(
    "45105021198189939921038535"
  );

  const output = Number(circSupply).toFixed();
  console.log(output);

  return Number(circSupply).toFixed();
}

async function getWrbctcCircSupply(): Promise<string> {
  const bridgeBalance = await web3.eth.getBalance(
    "0x0000000000000000000000000000000001000006"
  );
  return bignumber(21000000 * 1e18)
    .minus(bignumber(bridgeBalance))
    .toFixed(0);
}

async function getFishCircSupply(): Promise<string> {
  const date = new Date().toUTCString().slice(8, 16);
  const key = date.slice(0, 3) + "_" + date.slice(4, 14);
  return fishReleaseSchedule[key].toString().concat("000000000000000000");
}

async function getCirculatingSupply(
  symbol: string,
  id: string
): Promise<string> {
  if (circulatingSupplySpecial.hasOwnProperty(symbol)) {
    return await circulatingSupplySpecial[symbol]();
  } else {
    return await getTotalSupply(id);
  }
}

async function getTotalSupply(address: string): Promise<string> {
  const contract = createContract(abiErc20, address);
  const supply = await contract.methods.totalSupply().call();
  return supply;
}

getSovCircSupply();
// getGraphAssetData();
