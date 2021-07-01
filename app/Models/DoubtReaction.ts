import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Doubt } from './Doubt'

@Entity('esc_doubt_reactions')
export class DoubtReaction {
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

  /*
   * Relations
   */

  @ManyToOne(
    () => Doubt,
    doubt => doubt.doubtReactions,
  )
  doubt: Doubt
}
