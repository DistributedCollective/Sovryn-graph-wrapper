import { Entity, Column, PrimaryColumn } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class SummaryPairData extends AbstractBaseEntity {
  @PrimaryColumn()
  poolId!: string

  @Column()
  @Length(2, 10)
  baseSymbol!: string

  @Column()
  @Length(42)
  @IsEthereumAddress()
  baseId!: string

  @Column()
  @Length(2, 10)
  quoteSymbol!: string

  @Column()
  @Length(42)
  @IsEthereumAddress()
  quoteId!: string

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  baseVolume24h!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  quoteVolume24h!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  lastPrice!: number

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber()
  lastPriceUsd!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber()
  priceChangePercent24h!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber()
  priceChangePercentWeek!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber()
  priceChangePercent24hUsd!: number

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  @IsNumber()
  priceChangePercentWeekUsd!: number

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber()
  highUsd!: number

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber()
  lowUsd!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  highBtc!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  lowBtc!: number
}