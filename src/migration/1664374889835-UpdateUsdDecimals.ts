import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUsdDecimals1664374889835 implements MigrationInterface {
  name = 'UpdateUsdDecimals1664374889835'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "lastPriceUsd" TYPE numeric(40,8)')
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "highUsd" TYPE numeric(40,8)')
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "lowUsd" TYPE numeric(40,8)')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "lowUsd" TYPE numeric(40,2)')
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "highUsd" TYPE numeric(40,2)')
    await queryRunner.query('ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "lastPriceUsd" TYPE numeric(40,2)')
  }
}
