import { DoubtReaction } from 'app/Models/DoubtReaction'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(DoubtReaction)
@Ignore({ onlyFromImports: true })
export class DoubtReactionRepository extends TypeOrmRepository<DoubtReaction> {
  protected wheres: ['id', 'liked', 'createdAt', 'updatedAt']
  protected relations: []

  protected Model = new DoubtReaction()
}
