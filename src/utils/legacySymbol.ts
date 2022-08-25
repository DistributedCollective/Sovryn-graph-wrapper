import { isNil } from 'lodash'

const legacySymbol: { [key: string]: string } = {
  RBTC: 'RBTC',
  WRBTC: 'RBTC',
  ETHs: 'ETH',
  DOC: 'DOC',
  rUSDT: 'USDT',
  XUSD: 'XUSD',
  BITP: 'BPRO',
  SOV: 'SOV',
  MOC: 'MOC',
  BNBs: 'BNBS',
  FISH: 'FISH',
  RIF: 'RIF',
  MYNT: 'MYNT'
}

export const getLegacySymbol = (symbol: string): string => {
  return !isNil(legacySymbol[symbol]) ? legacySymbol[symbol] : symbol
}
