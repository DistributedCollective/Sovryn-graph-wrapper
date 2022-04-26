import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import config, { Environment } from '../config/config'
import {
  testnetAddresses,
  mainnetAddresses
} from '@blobfishkate/sovryncontractswip'

export const web3 = new Web3(config.RSKRpc)

export const addresses =
  config.env === Environment.Production ? mainnetAddresses : testnetAddresses

export const createContract = (abi: AbiItem[], address: string): Contract => {
  const contract = new web3.eth.Contract(abi, address.toLowerCase())
  return contract
}
