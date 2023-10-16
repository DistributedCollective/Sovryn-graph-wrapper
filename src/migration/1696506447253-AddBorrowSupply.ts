import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBorrowSupply1696506447253 implements MigrationInterface {
  name = 'AddBorrowSupply1696506447253'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "lending_apy" ADD "borrow" numeric(30,18) NOT NULL DEFAULT \'0\'')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "lending_apy" DROP COLUMN "borrow"')
  }
}
