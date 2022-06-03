import { getRepository } from 'typeorm'
import { LendingApy } from '../entity'
import { notEmpty } from '../utils/common'

export interface ILendingApyRow {
  contract: string
  borrowApr: string
  supplyApr: string
  supply: string
}

export async function saveMultipleLendingApyRows (
  rowData: ILendingApyRow[]
): Promise<LendingApy[]> {
  const repository = getRepository(LendingApy)
  const promises = rowData.map(async (data) => {
    const now = new Date()
    try {
      const newRowData = new LendingApy()
      newRowData.contract = data.contract
      newRowData.borrowApr = Number(data.borrowApr)
      newRowData.supplyApr = Number(data.supplyApr)
      newRowData.supply = Number(data.supply)
      newRowData.timestamp = now
      await newRowData.validateStrict()
      return newRowData
    } catch (error) {
      return null
    }
  })
  const validatedData = await Promise.all(promises)
  const filteredData = validatedData.filter(notEmpty)

  const result = repository.save(filteredData)
  return await result
}
