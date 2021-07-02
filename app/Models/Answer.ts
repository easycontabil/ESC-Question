import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'

import { Doubt } from './Doubt'
import { Comment } from './Comment'
import { AnswerReaction } from './AnswerReaction'

@Entity('esc_answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  userId: string

  @Column({ default: false })
  solved?: boolean

  @Column()
  content: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'deleted_at', default: null })
  deletedAt: Date

  @Column({ nullable: false })
  doubtId: string

  /*
   * Relations
   */

  @OneToMany(
    () => AnswerReaction,
    answerReaction => answerReaction.answer,
  )
  answerReactions: AnswerReaction[]

  @ManyToOne(
    () => Doubt,
    doubt => doubt.answers,
    { nullable: false },
  )
  doubt: Doubt

  @OneToMany(
    () => Comment,
    comment => comment.answer,
  )
  comments: Comment[]
}
