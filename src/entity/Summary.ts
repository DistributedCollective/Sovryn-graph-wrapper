import { Entity, Column, Unique, PrimaryColumn } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
@Unique('pair', ['tradingPair'])
export class SummaryPairData extends AbstractBaseEntity {
  @PrimaryColumn()
  @Length(83)
  tradingPair!: string

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

  @Column()
  @IsNumber()
  baseVolume24h!: number

  @Column()
  @IsNumber()
  quoteVolume24h!: number

  @Column()
  @IsNumber()
  lastPrice!: number

  @Column()
  @IsNumber()
  lastPriceUsd!: number

  @Column()
  @IsNumber()
  priceChangePercent24h!: number

  @Column()
  @IsNumber()
  priceChangePercentWeek!: number

  @Column()
  @IsNumber()
  priceChangePercent24hUsd!: number

  @Column()
  @IsNumber()
  priceChangePercentWeekUsd!: number

  @Column()
  @IsNumber()
  highUsd!: number

  @Column()
  @IsNumber()
  lowUsd!: number

  @Column()
  @IsNumber()
  highBtc!: number

  @Column()
  @IsNumber()
  lowBtc!: number
}
