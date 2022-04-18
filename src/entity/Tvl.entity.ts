import { Entity, Column, PrimaryColumn } from 'typeorm'

import {
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
  name!: string

  @Column()
  @IsNumberString()
  balance!: string

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber()
  balanceUsd?: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  balanceBtc?: number

  @Column({
    type: 'enum',
    enum: TvlGroup
  })
  tvlGroup!: TvlGroup
}
