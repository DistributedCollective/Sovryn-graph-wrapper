import {MigrationInterface, QueryRunner} from "typeorm";

export class DayPrice1659964541544 implements MigrationInterface {
    name = 'DayPrice1659964541544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" ADD "dayPrice" numeric(40,18) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liquidity_pool_summary" DROP COLUMN "dayPrice"`);
    }

}
