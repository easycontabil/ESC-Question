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

  @Column({ nullable: false })
  answerId: string

  @Column({ nullable: true })
  commentId?: string

  /*
   * Relations
   */

  @ManyToOne(
    () => Answer,
    answer => answer.comments,
  )
  answer: Answer

  @OneToOne(() => Comment, { nullable: true })
  comment: Comment
}
