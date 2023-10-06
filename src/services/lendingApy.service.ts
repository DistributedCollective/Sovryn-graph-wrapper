import { getQuery } from '../utils/apolloClient'
import { lendingPoolIds } from '../graphQueries/tvlContracts'
import { LendingPool } from '../generated-schema'
import { createContract } from '../utils/web3Provider'
import { abiLoanToken } from '@blobfishkate/sovryncontractswip'
import { Contract } from 'web3-eth-contract'
import { weiToFixed } from '../utils/helpers'
import {
  saveMultipleLendingApyRows,
  ILendingApyRow
} from '../models/lendingApy.model'
import log from '../logger'

const logger = log.logger.child({ module: 'Lending Apy Service' })

export default async function main (): Promise<void> {
  const pools = await getLendingPoolContracts()
  const rowData: ILendingApyRow[] = []
  for (const pool of pools) {
    try {
      const contract = createContract(abiLoanToken, pool)
      const borrowApr = await getBorrowApr(contract)
      const supplyApr = await getSupplyApr(contract)
      const supply = await getSupply(contract)
      const borrow = await getBorrow(contract)
      rowData.push({
        contract: pool,
        borrowApr: borrowApr,
        supplyApr: supplyApr,
        supply: supply,
        borrow: borrow
      })
    } catch (e) {
      const error = e as Error
      logger.error(`Error getting data for pool; ${pool}`, error.message)
    }
  }
  await saveMultipleLendingApyRows(rowData)
}

async function getLendingPoolContracts (): Promise<string[]> {
  const data: {
    lendingPools: LendingPool[]
  } = await getQuery(lendingPoolIds)
  const pools = data.lendingPools.map((item) => item.id)
  return pools
}

async function getBorrowApr (contract: Contract): Promise<string> {
  const borrowApr = await contract.methods.borrowInterestRate().call()
  return weiToFixed(borrowApr, 4)
}

async function getSupplyApr (contract: Contract): Promise<string> {
  const supplyApr = await contract.methods.supplyInterestRate().call()
  return weiToFixed(supplyApr, 4)
}

async function getSupply (contract: Contract): Promise<string> {
  const supply = await contract.methods.totalAssetSupply().call()
  return weiToFixed(supply, 18)
}

async function getBorrow (contract: Contract): Promise<string> {
  const supply = await contract.methods.totalAssetBorrow().call()
  return weiToFixed(supply, 18)
}

// main();
