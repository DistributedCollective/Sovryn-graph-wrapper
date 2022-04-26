import { Entity, Column, PrimaryColumn } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber, IsString } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class Asset extends AbstractBaseEntity {
  @PrimaryColumn()
  @Length(42)
  @IsEthereumAddress()
  id!: string

  @Column()
  @IsString()
  symbol?: string

  @Column()
  @IsString()
  name?: string

  @Column('decimal', { precision: 400, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  circulatingSupply!: number

  @Column({ nullable: true })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  cryptoAssetId!: number
}
