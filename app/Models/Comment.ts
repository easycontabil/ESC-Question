import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

import { Answer } from './Answer'
import { Doubt } from './Doubt'

@Entity('esc_comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', nullable: false })
  userId: string

  @Column()
  content: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'deleted_at', default: null })
  deletedAt: Date

  @Column({ nullable: true })
  answerId?: string

  @Column({ nullable: true })
  doubtId?: string

  /*
   * Relations
   */

  @ManyToOne(
    () => Answer,
    answer => answer.comments,
  )
  answer: Answer

  @ManyToOne(
    () => Doubt,
    doubt => doubt.comments,
  )
  doubt: Doubt
}
