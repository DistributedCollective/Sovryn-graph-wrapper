/* eslint-env jest */
import { calculatePriceChange } from './summary.service'

describe('calculatePriceChange()', () => {
  it('correctly calculates price change when change is > 100%', () => {
    const res = calculatePriceChange('2', '8')
    expect(res).toBe(-75)
  })
})
