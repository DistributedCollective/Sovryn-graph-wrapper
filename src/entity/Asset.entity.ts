import { Entity, Column, PrimaryColumn } from 'typeorm'

import {
  Length,
  IsEthereumAddress,
  IsNumber,
  IsNumberString
} from 'class-validator'

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

  /** This is a string because USDT circulating supply on testnet is waaaay too big, and these values aren't used in numeric operations  */
  @Column()
  @IsNumberString()
  circulatingSupply!: string

  @Column({ nullable: true })
  @IsNumber()
  cryptoAssetId!: number
}
