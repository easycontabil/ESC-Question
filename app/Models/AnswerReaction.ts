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

  @Column()
  userId?: string

  @Column()
  answerId?: string

  @Column({ nullable: true })
  categoryId?: string

  /*
   * Relations
   */

  @ManyToOne(
    () => Answer,
    answer => answer.answerReactions,
  )
  answer: Answer

  @ManyToOne(() => Category, { nullable: true })
  category: Category
}
