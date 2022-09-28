import { Entity, Column, PrimaryColumn } from 'typeorm'

import {
  Length,
  IsEthereumAddress,
  IsNumber,
  IsAlphanumeric
} from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class LiquidityPoolSummary extends AbstractBaseEntity {
  @PrimaryColumn()
  @IsEthereumAddress()
  poolId!: string

  @Column()
  @Length(2, 10)
  @IsAlphanumeric()
  baseSymbol!: string

  @Column()
  @Length(42)
  @IsEthereumAddress()
  baseId!: string

  @Column()
  @Length(2, 10)
  @IsAlphanumeric()
  quoteSymbol!: string

  @Column()
  @Length(42)
  @IsEthereumAddress()
  quoteId!: string

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  baseVolume24h!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  quoteVolume24h!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  lastPrice!: number

  @Column('decimal', { precision: 40, scale: 8 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 8 })
  lastPriceUsd!: number

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercent24h!: number

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercentWeek!: number

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercent24hUsd!: number

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercentWeekUsd!: number

  @Column('decimal', { precision: 40, scale: 8 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 8 })
  highUsd!: number

  @Column('decimal', { precision: 40, scale: 8 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 8 })
  lowUsd!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  highBtc!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  lowBtc!: number

  /** dayPrice is the price of this token 1 day ago. It is used by the frontend to calculate the price change between non-BTC pairs (eg SOV-ETH) */
  @Column('decimal', { precision: 40, scale: 18, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  dayPrice!: number

  @Column('decimal', { precision: 40, scale: 18, nullable: true })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  baseAssetLiquidity?: number

  @Column('decimal', { precision: 40, scale: 18, nullable: true })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  quoteAssetLiquidity?: number
}
