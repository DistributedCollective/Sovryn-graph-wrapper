import { getQuery } from '../utils/apolloClient'
import { assetDataQuery } from '../graphQueries/priceAndVolume'
import { abiErc20 } from '@blobfishkate/sovryncontractswip'
import { addresses, createContract, web3 } from '../utils/web3Provider'
import { bignumber } from 'mathjs'
import { fishReleaseSchedule } from '../utils/fishCircSupply'
import { isNil } from 'lodash'
import { Token } from '../../generated-schema'
import { createMultipleAssets } from '../models/asset.model'
import { createIlliquidSovRow } from '../models/illiquidSov.model'
import log from '../logger'

const logger = log.logger.child({ module: 'Assets' })

export interface AssetData {
  id: string
  symbol: string | undefined
  name: string | undefined
  circulatingSupply: number
  cryptoAssetId: number
}

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
        circulatingSupply: parseFloat(
          bignumber(circSupply).div(1e18).toFixed(18)
        ),
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
    sovBalance: Number(bignumber(stakingBalance).div(1e18).toFixed(18))
  })

  const adoptionBalance: string = await sovContract.methods
    .balanceOf(addresses.AdoptionFund.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.AdoptionFund.toLowerCase(),
    name: 'AdoptionFund',
    sovBalance: Number(bignumber(adoptionBalance).div(1e18).toFixed(18))
  })

  const developmentBalance: string = await sovContract.methods
    .balanceOf(addresses.DevelopmentFund.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.DevelopmentFund.toLowerCase(),
    name: 'DevelopmentFund',
    sovBalance: Number(bignumber(developmentBalance).div(1e18).toFixed(18))
  })

  const lockedSovBalance: string = await sovContract.methods
    .balanceOf(addresses.lockedSOV.toLowerCase())
    .call()

  await createIlliquidSovRow({
    contract: addresses.lockedSOV.toLowerCase(),
    name: 'LockedSov',
    sovBalance: Number(bignumber(lockedSovBalance).div(1e18).toFixed(18))
  })

  const circSupply = bignumber(100 * 1e6 * 1e18)
    .minus(stakingBalance)
    .minus(developmentBalance)
    .minus(adoptionBalance)
    .minus(lockedSovBalance)

  const output = bignumber(circSupply).toFixed()
  return output
}

async function getWrbtcCircSupply (): Promise<string> {
  const bridgeBalance = await web3.eth.getBalance(
    /** MOVE TO CONFIG */
    '0x0000000000000000000000000000000001000006'
  )
  return bignumber(21000000 * 1e18)
    .minus(bignumber(bridgeBalance))
    .toFixed(0)
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
