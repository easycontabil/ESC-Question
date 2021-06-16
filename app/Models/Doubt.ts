import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'

import { Answer } from './Answer'
import { Category } from './Category'
import { DoubtReaction } from './DoubtReaction'
import { User } from './User'

@Entity('esc_doubts')
export class Doubt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @UpdateDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  /*
   * Relations
   */

  @OneToMany(
    () => DoubtReaction,
    doubtReaction => doubtReaction.doubt,
  )
  doubtReactions: DoubtReaction[]

  @OneToMany(
    () => Answer,
    answer => answer.doubt,
  )
  answers: Answer[]

  @OneToMany(
    () => Category,
    category => category.doubt,
  )
  categories: Category[]

  @ManyToOne(
    () => User,
    user => user.answers,
  )
  user: User
}
