/* eslint-env jest */
import { calculatePriceChange, getHighAndLowPrices } from './summary.service'

describe('calculatePriceChange()', () => {
  it('correctly calculates price change when change is > 100%', () => {
    const res = calculatePriceChange('2', '8')
    expect(res).toBe(-75)
  })
})

describe('getHighLowPrices()', () => {
  it('correctly gets high prices for ETH', async () => {
    const mainnetETH = '0x1d931bf8656d795e50ef6d639562c5bd8ac2b78f'
    const testLowBtcPrice = 0.00001
    const testLowUsdPrice = 1
    const res = await getHighAndLowPrices(
      mainnetETH,
      testLowBtcPrice,
      testLowUsdPrice
    )
    console.log(res)
    expect(res.highUsd).toBeGreaterThan(testLowUsdPrice)
    expect(res.highBtc).toBeGreaterThan(testLowBtcPrice)
  })
  it('correctly gets low prices for ETH', async () => {
    const mainnetETH = '0x1d931bf8656d795e50ef6d639562c5bd8ac2b78f'
    const testHighBtcPrice = 1
    const testHighUsdPrice = 100000
    const res = await getHighAndLowPrices(
      mainnetETH,
      testHighBtcPrice,
      testHighUsdPrice
    )
    console.log(res)
    expect(res.lowUsd).toBeLessThan(testHighUsdPrice)
    expect(res.lowBtc).toBeLessThan(testHighBtcPrice)
  })
})
