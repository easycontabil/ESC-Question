import { User } from 'app/Models/User'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(User)
@Ignore({ onlyFromImports: true })
export class UserRepository extends TypeOrmRepository<User> {
  protected wheres: [
    'id',
    'name',
    'email',
    'role',
    'status',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  protected relations: [
    'doubts',
    'answers',
    'comments',
    'answerReactions',
    'doubtReactions',
  ]

  protected Model = User.name
}
