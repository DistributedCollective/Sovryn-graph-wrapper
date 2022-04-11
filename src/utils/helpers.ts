import { bignumber } from 'mathjs'

export const inversePrice = (
  price: string | number,
  decimals: number
): number => {
  return Number(bignumber(1).div(price).toFixed(decimals))
}
