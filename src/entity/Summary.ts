import { Entity, Column, Unique } from 'typeorm'

import { Length, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
@Unique('pair', ['tradingPair'])
export class Summary extends AbstractBaseEntity {
  @Column()
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
  dayPrice!: number

  @Column()
  @IsNumber()
  weekPrice!: number
}
