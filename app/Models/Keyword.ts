import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToMany,
} from 'typeorm'

// import { Category } from './Category'

@Entity('esc_keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  /*
   * Relations
   */

  // @ManyToMany(
  //   () => Category,
  //   category => category.keywords,
  // )
  // categories: Category[]
}
