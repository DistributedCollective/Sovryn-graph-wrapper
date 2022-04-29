/** This entity stores the breakdown of SOV circulating supply */

import { Entity, Column, PrimaryColumn } from 'typeorm'

import { IsEthereumAddress, IsNumber, Length } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class IlliquidSov extends AbstractBaseEntity {
  @PrimaryColumn({ type: 'date' })
  date!: string

  @PrimaryColumn()
  @IsEthereumAddress()
  contract!: string

  @Column()
  @Length(2, 20)
  name!: string

  @Column('decimal', { precision: 30, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  sovBalance!: number
}
