import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { UserToken } from './UserToken'
import { Answer } from './Answer'
import { Doubt } from './Doubt'
import { AnswerReaction } from './AnswerReaction'
import { DoubtReaction } from './DoubtReaction'
import { Comment } from './Comment'
import { Notification } from './Notification'
import Env from '@secjs/env'

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

  @Column({ default: 0 })
  points: number

  @Column({
    default: `${Env('APP_URL', 'http://127.0.0.1')}/grd/statics/default.png`,
  })
  image: string

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

  @Column({ default: 0 })
  nmrDuvidas: number

  @Column({ default: 0 })
  nmrRespostas: number

  @Column({ default: 0 })
  nmrResolucoes: number

  @OneToMany(
    () => UserToken,
    token => token.user,
  )
  tokens: UserToken[]

  @OneToMany(
    () => Notification,
    notification => notification.user,
  )
  notifications: Notification[]

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

  toJSON() {
    const json = { ...this }

    Object.keys(json).forEach(key => {
      if (this.hidden.includes(key)) delete json[key]
    })

    return json
  }

  get hidden() {
    return ['password']
  }

  get includes() {
    return []
  }

  get where() {
    return [
      'id',
      'name',
      'email',
      'role',
      'status',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ]
  }
}
