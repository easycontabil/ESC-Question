import { Answer } from 'app/Models/Answer'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Answer)
@Ignore({ onlyFromImports: true })
export class AnswerRepository extends TypeOrmRepository<Answer> {
  protected wheres: [
    'id',
    'solved',
    'content',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  protected relations: ['doubt', 'comments', 'answerReaction']

  protected Model = Answer.name
}
