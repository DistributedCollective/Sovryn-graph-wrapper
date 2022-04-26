import { IlliquidSov } from '../entity'
import { getRepository } from 'typeorm'
import { isNil } from 'lodash'

interface IIlliquidSovData {
  contract: string
  name: string
  sovBalance: number
}

export const createIlliquidSovRow = async (
  illiquidSovData: IIlliquidSovData
): Promise<void> => {
  const repository = getRepository(IlliquidSov)
  const newIlliquidSovRow = new IlliquidSov()
  const date = new Date()
  newIlliquidSovRow.date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`
  newIlliquidSovRow.contract = illiquidSovData.contract
  newIlliquidSovRow.name = illiquidSovData.name
  newIlliquidSovRow.sovBalance = illiquidSovData.sovBalance

  await newIlliquidSovRow.validateStrict()

  /**
   * Find then update. Composite keys don't work will with upsert method
   */

  const existingEntity = await repository.findOne({
    date: newIlliquidSovRow.date,
    contract: newIlliquidSovRow.contract
  })

  const entity = repository.merge(
    !isNil(existingEntity) ? existingEntity : newIlliquidSovRow,
    newIlliquidSovRow
  )
  await entity.save()
}

export const getAllIlliquidSovData = async (): Promise<IlliquidSov[]> => {
  const repository = getRepository(IlliquidSov)
  const data = await repository.find()
  return data
}
