import { Entity, Column, PrimaryColumn } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class Asset extends AbstractBaseEntity {
  @PrimaryColumn()
  @Length(42)
  @IsEthereumAddress()
  id!: string

  @Column()
  symbol?: string

  @Column()
  name?: string

  @Column('decimal', { precision: 400, scale: 18 })
  @IsNumber()
  circulatingSupply!: number

  @Column({ nullable: true })
  @IsNumber()
  cryptoAssetId!: number
}
