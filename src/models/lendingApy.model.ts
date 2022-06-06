import { getRepository, MoreThan } from "typeorm";
import { LendingApy } from "../entity";
import { notEmpty } from "../utils/common";

export interface ILendingApyRow {
  contract: string;
  borrowApr: string;
  supplyApr: string;
  supply: string;
}

export async function saveMultipleLendingApyRows(
  rowData: ILendingApyRow[]
): Promise<LendingApy[]> {
  const repository = getRepository(LendingApy);
  const promises = rowData.map(async (data) => {
    const now = new Date();
    try {
      const newRowData = new LendingApy();
      newRowData.contract = data.contract;
      newRowData.borrowApr = Number(data.borrowApr);
      newRowData.supplyApr = Number(data.supplyApr);
      newRowData.supply = Number(data.supply);
      newRowData.timestamp = now;
      await newRowData.validateStrict();
      return newRowData;
    } catch (error) {
      return null;
    }
  });
  const validatedData = await Promise.all(promises);
  const filteredData = validatedData.filter(notEmpty);

  const result = repository.save(filteredData);
  return await result;
}

export async function getLendingPoolApy(
  pool: string,
  days: number = 14
): Promise<LendingApy[]> {
  const daysInMilliseconds = days * 24 * 60 * 1000;
  const startDate = new Date(Date.now() - daysInMilliseconds);
  const repository = getRepository(LendingApy);
  const data = await repository.find({
    where: {
      contract: pool,
      timestamp: MoreThan(startDate),
    },
  });
  return data;
}
