import { Entity, Column, PrimaryColumn } from 'typeorm'

import {
  IsAscii,
  IsEthereumAddress,
  IsNumber,
  IsNumberString,
  Length
} from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'
import { TvlGroup } from '../services/tvl.service'

@Entity()
export class Tvl extends AbstractBaseEntity {
  @PrimaryColumn({ type: 'date' })
  date!: string

  @PrimaryColumn()
  @IsEthereumAddress()
  contract!: string

  @PrimaryColumn()
  @IsEthereumAddress()
  asset!: string

  @Column()
  @Length(2, 20)
  @IsAscii()
  name!: string

  @Column()
  @IsNumberString()
  balance!: string

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  balanceUsd?: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  balanceBtc?: number

  @Column({
    type: 'enum',
    enum: TvlGroup
  })
  tvlGroup!: TvlGroup
}
