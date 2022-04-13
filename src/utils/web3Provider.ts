import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import config from '../config/config'
import {
  testnetAddresses,
  mainnetAddresses
} from '@blobfishkate/sovryncontractswip'

export const web3 = new Web3(
  config.env === 'production' ? config.RSKMainnet : config.RSKTestnet
)

export const addresses =
  config.env === 'production' ? mainnetAddresses : testnetAddresses

export const createContract = (abi: AbiItem[], address: string): Contract => {
  const contract = new web3.eth.Contract(abi, address.toLowerCase())
  return contract
}
