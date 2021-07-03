import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { Doubt } from './Doubt'
import { Keyword } from './Keyword'

@Entity('esc_categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ nullable: true })
  doubtId?: string

  /*
   * Relations
   */

  @OneToOne(() => Category, { nullable: true })
  category: Category

  @ManyToMany(() => Keyword)
  @JoinTable()
  keywords: Keyword[]

  @ManyToOne(
    () => Doubt,
    doubt => doubt.categories,
    { nullable: true },
  )
  doubt?: Doubt
}
