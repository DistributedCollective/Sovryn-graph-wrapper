import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1655368782544 implements MigrationInterface {
    name = 'Init1655368782544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lending_apy" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "contract" character varying NOT NULL, "supply" numeric(30,18) NOT NULL, "supplyApr" numeric(10,4) NOT NULL, "borrowApr" numeric(10,4) NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_582669cb3b2c7bec872fad8ee19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d22e241aac6b96fe5366fbfdc" ON "lending_apy" ("contract") `);
        await queryRunner.query(`CREATE INDEX "IDX_ddf402b28f8e7ab16e1e0f7922" ON "lending_apy" ("timestamp") `);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercent24h" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercentWeek" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercent24hUsd" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercentWeekUsd" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercentWeekUsd" TYPE numeric(6,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercent24hUsd" TYPE numeric(6,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercentWeek" TYPE numeric(6,2)`);
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ALTER COLUMN "priceChangePercent24h" TYPE numeric(6,2)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddf402b28f8e7ab16e1e0f7922"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d22e241aac6b96fe5366fbfdc"`);
        await queryRunner.query(`DROP TABLE "lending_apy"`);
    }

}
