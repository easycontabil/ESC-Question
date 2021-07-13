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
import { Comment } from './Comment'
import { User } from './User'

@Entity('esc_doubts')
export class Doubt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  userId: string

  @Column({ default: false, nullable: true })
  solved?: boolean

  @Column()
  title: string

  @Column()
  description: string

  @Column({ name: 'closed_at', nullable: true, default: null })
  closedAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'deleted_at', default: null })
  deletedAt: Date

  /*
   * Relations
   */

  @ManyToOne(
    () => User,
    user => user.answerReactions,
    { nullable: false },
  )
  user: User

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
    () => Comment,
    comment => comment.doubt,
  )
  comments: Comment[]

  @OneToMany(
    () => Category,
    category => category.doubt,
  )
  categories: Category[]
}
