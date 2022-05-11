import { getQuery } from '../utils/apolloClient'
import { assetDataQuery } from '../graphQueries/priceAndVolume'
import { abiErc20 } from '@blobfishkate/sovryncontractswip'
import { addresses, createContract, web3 } from '../utils/web3Provider'
import { bignumber } from 'mathjs'
import { fishReleaseSchedule } from '../utils/fishCircSupply'
import { isNil } from 'lodash'
import { Token } from '../generated-schema'
import { createMultipleAssets } from '../models/asset.model'
import { createIlliquidSovRow } from '../models/illiquidSov.model'
import { AssetData } from '../utils/interfaces'
import config from '../config/config'
import log from '../logger'
import { weiToFixed } from '../utils/helpers'

const logger = log.logger.child({ module: 'Assets' })
const { sovTotalSupply, twoWayPegAddress } = config

const cryptoAssetIds: { [key: string]: number } = {
  SOV: 8669,
  WRBTC: 3626
}

export default async function main (): Promise<void> {
  logger.info('Running assets main function')
  const { protocolStats } = await getQuery(assetDataQuery)
  const tokens = protocolStats.tokens as Token[]
  const assetData: AssetData[] = []
  for (const item of tokens) {
    try {
      const symbol = item.symbol?.toString()
      const circSupply = await getCirculatingSupply(symbol, item.id)
      const cryptoAssetId =
        !isNil(symbol) && !isNil(cryptoAssetIds[symbol])
          ? cryptoAssetIds[symbol]
          : 0
      assetData.push({
        id: item.id,
        symbol: symbol,
        name: item.name?.toString(),
        circulatingSupply: Number(weiToFixed(circSupply)),
        cryptoAssetId: cryptoAssetId
      })
    } catch (e) {
      logger.error(
        `Could not get circulating supply for: ${
          !isNil(item.symbol) ? item.symbol : item.id
        }`
      )
    }
  }
  await createMultipleAssets(assetData)
  logger.info('Assets main function completed')
}

const circulatingSupplySpecial: { [key: string]: () => Promise<string> } = {
  SOV: getSovCircSupply,
  WRBTC: getWrbtcCircSupply,
  FISH: getFishCircSupply
}

/** TODO: Dry up this function */
async function getSovCircSupply (): Promise<string> {
  const sovContract = createContract(
    abiErc20,
    addresses.SOV_token.toLowerCase()
  )
  const stakingBalance: string = await sovContract.methods
    .balanceOf(addresses.staking.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.staking.toLowerCase(),
    name: 'Staking',
    sovBalance: Number(weiToFixed(stakingBalance))
  })

  const adoptionBalance: string = await sovContract.methods
    .balanceOf(addresses.AdoptionFund.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.AdoptionFund.toLowerCase(),
    name: 'AdoptionFund',
    sovBalance: Number(weiToFixed(adoptionBalance))
  })

  const developmentBalance: string = await sovContract.methods
    .balanceOf(addresses.DevelopmentFund.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.DevelopmentFund.toLowerCase(),
    name: 'DevelopmentFund',
    sovBalance: Number(weiToFixed(developmentBalance))
  })

  const lockedSovBalance: string = await sovContract.methods
    .balanceOf(addresses.lockedSOV.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.lockedSOV.toLowerCase(),
    name: 'LockedSov',
    sovBalance: Number(weiToFixed(lockedSovBalance))
  })

  const circSupply = bignumber(sovTotalSupply)
    .minus(stakingBalance)
    .minus(developmentBalance)
    .minus(adoptionBalance)
    .minus(lockedSovBalance)

  const output = bignumber(circSupply).toFixed()
  return output
}

async function getWrbtcCircSupply (): Promise<string> {
  const bridgeBalance = await web3.eth.getBalance(twoWayPegAddress)
  const maxRbtcSupply = 21000000 * 1e18
  return bignumber(maxRbtcSupply).minus(bignumber(bridgeBalance)).toFixed(0)
}

async function getFishCircSupply (): Promise<string> {
  const date = new Date().toUTCString().slice(8, 16)
  const key = date.slice(0, 3) + '_' + date.slice(4, 14)
  return fishReleaseSchedule[key].toString().concat('000000000000000000')
}

async function getCirculatingSupply (
  symbol: string | undefined,
  id: string
): Promise<string> {
  /** For most tokens (unless special), circulating supply is total supply **/
  if (!isNil(symbol) && !isNil(circulatingSupplySpecial[symbol])) {
    return await circulatingSupplySpecial[symbol]()
  } else {
    return await getTotalSupply(id)
  }
}

async function getTotalSupply (address: string): Promise<string> {
  const contract = createContract(abiErc20, address)
  const supply = await contract.methods.totalSupply().call()
  return supply
}
