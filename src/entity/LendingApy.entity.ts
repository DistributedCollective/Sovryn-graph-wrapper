/** This entity holds polled data for the apy of the lending pools */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { IsDate, IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class LendingApy extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  @IsEthereumAddress()
  contract!: string

  @Column('decimal', { precision: 30, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  supply!: number

  @Column('decimal', { precision: 10, scale: 4 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  supplyApr!: number

  @Column('decimal', { precision: 10, scale: 4 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  borrowApr!: number

  @Column()
  @IsDate()
  timestamp!: Date
}
