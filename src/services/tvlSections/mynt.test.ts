import { getMyntTvl } from './mynt'
import log from '../../logger'
import * as TvlModel from '../../models/tvl.model'
import { mockTokens } from '../../mocks/tokens'

const mockCreateTvlRow = jest.spyOn(TvlModel, 'createTvlRow')

describe('getMyntTvl', () => {
  const logger = log.logger.child({ module: 'TestLogger' })
  beforeEach(() => {
    mockCreateTvlRow.mockImplementation(async () => {
      return await Promise.resolve()
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('gets mynt tvl', async () => {
    await getMyntTvl(mockTokens, logger)
    expect(mockCreateTvlRow.mock.calls.length).toBe(3)
    const ZUSDResult = mockCreateTvlRow.mock.calls[2][0]
    expect(ZUSDResult.name).toBe('ZUSD_Mynt')
    console.log(mockCreateTvlRow.mock.calls)
    expect(Number(ZUSDResult.balance)).toBeGreaterThan(0)
    expect(Number(ZUSDResult.balanceBtc)).toBeGreaterThan(0)
    expect(Number(ZUSDResult.balanceUsd)).toBeGreaterThan(0)
  })
})
