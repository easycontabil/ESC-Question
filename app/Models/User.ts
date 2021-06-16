import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { Doubt } from './Doubt'
import { Answer } from './Answer'
import { Comment } from './Comment'
import { UserToken } from './UserToken'
import { DoubtReaction } from './DoubtReaction'
import { AnswerReaction } from './AnswerReaction'

@Entity('esc_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ enum: ['accountant', 'customer', 'admin'], default: 'customer' })
  role: string

  @Column({ enum: ['pendent', 'active'], default: 'pendent' })
  status: string

  @Column({ name: 'deleted_at', default: null })
  deletedAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(
    () => UserToken,
    token => token.user,
  )
  tokens: UserToken[]

  @OneToMany(
    () => Comment,
    comment => comment.user,
  )
  comments: Comment[]

  @OneToMany(
    () => Answer,
    answer => answer.user,
  )
  answers: Answer[]

  @OneToMany(
    () => Doubt,
    doubt => doubt.user,
  )
  doubts: Doubt[]

  @OneToMany(
    () => AnswerReaction,
    answerReaction => answerReaction.user,
  )
  answerReactions: AnswerReaction[]

  @OneToMany(
    () => DoubtReaction,
    doubtReaction => doubtReaction.user,
  )
  doubtReactions: DoubtReaction[]
}
