import { ITvl } from "../services/tvl.service";
import { Tvl } from "../entity";
import { getRepository } from "typeorm";
import { isNil } from "lodash";

export const createTvlRow = async (tvlData: ITvl): Promise<void> => {
  const repository = getRepository(Tvl);
  const newTvlRow = new Tvl();
  const date = new Date();
  newTvlRow.date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  newTvlRow.contract = tvlData.contract;
  newTvlRow.asset = tvlData.asset;
  newTvlRow.name = tvlData.name;
  newTvlRow.balance = tvlData.balance;
  newTvlRow.balanceUsd = Number(tvlData.balanceUsd);
  newTvlRow.balanceBtc = Number(tvlData.balanceBtc);
  newTvlRow.tvlGroup = tvlData.tvlGroup;

  await newTvlRow.validateStrict();

  /**
   * Find then update. Composite keys don't work will with upsert method
   */

  const existingEntity = await repository.findOne({
    date: newTvlRow.date,
    contract: newTvlRow.contract,
    asset: newTvlRow.asset,
  });

  if (!isNil(existingEntity)) {
    await repository.update(
      {
        date: newTvlRow.date,
        contract: newTvlRow.contract,
        asset: newTvlRow.asset,
      },
      newTvlRow
    );
  } else {
    await repository.insert(newTvlRow);
  }
};

export const getAllTvlData = async (): Promise<Tvl[]> => {
  const repository = getRepository(Tvl);
  const data = await repository.find();
  return data;
};
