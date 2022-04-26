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

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  lastPriceUsd!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercent24h!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercentWeek!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercent24hUsd!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  priceChangePercentWeekUsd!: number

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  highUsd!: number

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  lowUsd!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  highBtc!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  lowBtc!: number

  @Column('decimal', { precision: 40, scale: 18, nullable: true })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  baseAssetLiquidity?: number

  @Column('decimal', { precision: 40, scale: 18, nullable: true })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  quoteAssetLiquidity?: number
}