import { MigrationInterface, QueryRunner } from 'typeorm'

export class TvlGroupEnum1660550354504 implements MigrationInterface {
  name = 'TvlGroupEnum1660550354504'

  public async up (queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('ALTER TYPE "public"."tvl_tvlgroup_enum" RENAME TO "tvl_tvlgroup_enum_old"')
    // await queryRunner.query('CREATE TYPE "public"."tvl_tvlgroup_enum" AS ENUM(\'tvlAmm\', \'tvlLending\', \'tvlProtocol\', \'tvlSubprotocols\', \'tvlStaking\', \'tvlZero\')')
    // await queryRunner.query('ALTER TABLE "tvl" ALTER COLUMN "tvlGroup" TYPE "public"."tvl_tvlgroup_enum" USING "tvlGroup"::"text"::"public"."tvl_tvlgroup_enum"')
    // await queryRunner.query('DROP TYPE "public"."tvl_tvlgroup_enum_old"')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."tvl_tvlgroup_enum_old" AS ENUM(\'tvlAmm\', \'tvlLending\', \'tvlProtocol\', \'tvlSubprotocols\', \'tvlStaking\')')
    await queryRunner.query('ALTER TABLE "tvl" ALTER COLUMN "tvlGroup" TYPE "public"."tvl_tvlgroup_enum_old" USING "tvlGroup"::"text"::"public"."tvl_tvlgroup_enum_old"')
    await queryRunner.query('DROP TYPE "public"."tvl_tvlgroup_enum"')
    await queryRunner.query('ALTER TYPE "public"."tvl_tvlgroup_enum_old" RENAME TO "tvl_tvlgroup_enum"')
  }
}
