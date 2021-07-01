import { AnswerReaction } from 'app/Models/AnswerReaction'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(AnswerReaction)
@Ignore({ onlyFromImports: true })
export class AnswerReactionRepository extends TypeOrmRepository<
  AnswerReaction
> {
  protected wheres: ['id', 'liked', 'createdAt', 'updatedAt', 'deletedAt']
  protected relations: []

  protected Model = AnswerReaction.name
}
