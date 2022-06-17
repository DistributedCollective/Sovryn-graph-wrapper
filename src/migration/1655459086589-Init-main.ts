import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitMain1655459086589 implements MigrationInterface {
  name = 'InitMain1655459086589'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "liquidity_pool_summary" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "poolId" character varying NOT NULL, "baseSymbol" character varying NOT NULL, "baseId" character varying NOT NULL, "quoteSymbol" character varying NOT NULL, "quoteId" character varying NOT NULL, "baseVolume24h" numeric(40,18) NOT NULL, "quoteVolume24h" numeric(40,18) NOT NULL, "lastPrice" numeric(40,18) NOT NULL, "lastPriceUsd" numeric(40,2) NOT NULL, "priceChangePercent24h" numeric(10,2) NOT NULL DEFAULT \'0\', "priceChangePercentWeek" numeric(10,2) NOT NULL DEFAULT \'0\', "priceChangePercent24hUsd" numeric(10,2) NOT NULL DEFAULT \'0\', "priceChangePercentWeekUsd" numeric(10,2) NOT NULL DEFAULT \'0\', "highUsd" numeric(40,2) NOT NULL, "lowUsd" numeric(40,2) NOT NULL, "highBtc" numeric(40,18) NOT NULL, "lowBtc" numeric(40,18) NOT NULL, "baseAssetLiquidity" numeric(40,18), "quoteAssetLiquidity" numeric(40,18), CONSTRAINT "PK_2095e60a76e58a6ace554745790" PRIMARY KEY ("poolId"))')
    await queryRunner.query('CREATE TABLE "asset" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "circulatingSupply" numeric(400,18) NOT NULL, "cryptoAssetId" integer, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TYPE "public"."tvl_tvlgroup_enum" AS ENUM(\'tvlAmm\', \'tvlLending\', \'tvlProtocol\', \'tvlSubprotocols\', \'tvlStaking\')')
    await queryRunner.query('CREATE TABLE "tvl" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" date NOT NULL, "contract" character varying NOT NULL, "asset" character varying NOT NULL, "name" character varying NOT NULL, "balance" character varying NOT NULL, "balanceUsd" numeric(40,2) NOT NULL, "balanceBtc" numeric(40,18) NOT NULL, "tvlGroup" "public"."tvl_tvlgroup_enum" NOT NULL, CONSTRAINT "PK_e445ec113d985dbdeb34a4e151e" PRIMARY KEY ("date", "contract", "asset"))')
    await queryRunner.query('CREATE TABLE "illiquid_sov" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" date NOT NULL, "contract" character varying NOT NULL, "name" character varying NOT NULL, "sovBalance" numeric(30,18) NOT NULL, CONSTRAINT "PK_8a010c67f32fe49d0d6200286d5" PRIMARY KEY ("date", "contract"))')
    await queryRunner.query('CREATE TABLE "lending_apy" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "contract" character varying NOT NULL, "supply" numeric(30,18) NOT NULL, "supplyApr" numeric(10,4) NOT NULL, "borrowApr" numeric(10,4) NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_582669cb3b2c7bec872fad8ee19" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE INDEX "IDX_3d22e241aac6b96fe5366fbfdc" ON "lending_apy" ("contract") ')
    await queryRunner.query('CREATE INDEX "IDX_ddf402b28f8e7ab16e1e0f7922" ON "lending_apy" ("timestamp") ')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_ddf402b28f8e7ab16e1e0f7922"')
    await queryRunner.query('DROP INDEX "public"."IDX_3d22e241aac6b96fe5366fbfdc"')
    await queryRunner.query('DROP TABLE "lending_apy"')
    await queryRunner.query('DROP TABLE "illiquid_sov"')
    await queryRunner.query('DROP TABLE "tvl"')
    await queryRunner.query('DROP TYPE "public"."tvl_tvlgroup_enum"')
    await queryRunner.query('DROP TABLE "asset"')
    await queryRunner.query('DROP TABLE "liquidity_pool_summary"')
  }
}
