import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Answer } from './Answer'
import { Category } from './Category'
import { User } from './User'

@Entity('esc_answer_reactions')
export class AnswerReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  liked: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'deleted_at', default: null })
  deletedAt: Date

  @Column({ nullable: false })
  userId: string

  @Column({ nullable: false })
  answerId: string

  @Column({ nullable: true })
  categoryId?: string

  /*
   * Relations
   */

  @ManyToOne(
    () => User,
    user => user.answerReactions,
    { nullable: false },
  )
  user: User

  @ManyToOne(
    () => Answer,
    answer => answer.answerReactions,
    { nullable: false },
  )
  answer: Answer

  @ManyToOne(() => Category, { nullable: true })
  category: Category
}
