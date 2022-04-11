import { Entity, Column, PrimaryColumn } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class AssetData extends AbstractBaseEntity {
  @PrimaryColumn()
  @Length(42)
  @IsEthereumAddress()
  assetId!: string

  @Column()
  assetSymbol!: string

  @Column()
  assetName!: string

  @Column('decimal', { scale: 6, precision: 4, nullable: true, default: null })
  @IsNumber()
  tradingFee?: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  circulatingSupply!: number

  @Column({ nullable: true, default: null })
  @IsNumber()
  unifiedCryptoAssetId?: number
}
