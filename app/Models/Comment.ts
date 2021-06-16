import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm'

import { Answer } from './Answer'
import { User } from './User'

@Entity('esc_comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @UpdateDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  /*
   * Relations
   */

  @ManyToOne(
    () => Answer,
    answer => answer.comments,
  )
  answer: Answer

  @OneToOne(() => Comment)
  comment: Comment

  @ManyToOne(
    () => User,
    user => user.answers,
  )
  user: User
}
