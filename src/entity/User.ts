import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ readonly: true })
  firstName!: string

  @Column({ readonly: true })
  lastName!: string

  @Column({ readonly: true })
  email!: string

  @CreateDateColumn({ readonly: true })
  createdAt!: Date

  @UpdateDateColumn({ readonly: true })
  updatedAt!: Date
}