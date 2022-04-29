import { Entity, Column, PrimaryColumn } from 'typeorm'

import { IsEthereumAddress, IsNumber, IsNumberString } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class Tvl extends AbstractBaseEntity {
  @PrimaryColumn()
  date!: Date

  @PrimaryColumn()
  @IsEthereumAddress()
  contract!: string

  @PrimaryColumn()
  @IsEthereumAddress()
  asset!: string

  @Column()
  @IsNumberString()
  balance!: string

  @Column('decimal', { precision: 40, scale: 2 })
  @IsNumber()
  balanceUsd!: number

  @Column('decimal', { precision: 40, scale: 18 })
  @IsNumber()
  balanceBtc!: number
}
