import { bignumber } from 'mathjs'

export const inversePrice = (
  price: string | number,
  decimals: number
): number => {
  return Number(bignumber(1).div(price).toFixed(decimals))
}

export const weiToFixed = (
  numString: string,
  decimals: number = 18
): string => {
  return bignumber(numString).div(1e18).toFixed(decimals)
}
