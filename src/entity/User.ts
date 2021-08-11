import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

import { IsInt, Length, IsEmail } from 'class-validator'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsInt()
  id!: number

  @Column()
  @Length(2, 10)
  firstName!: string

  @Column()
  @Length(2, 10)
  lastName!: string

  @Column()
  @IsEmail()
  email!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
