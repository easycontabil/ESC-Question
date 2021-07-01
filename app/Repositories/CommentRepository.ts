import { Comment } from 'app/Models/Comment'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Comment)
@Ignore({ onlyFromImports: true })
export class CommentRepository extends TypeOrmRepository<Comment> {
  protected wheres: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt']
  protected relations: ['answer', 'comment']

  protected Model = Comment.name
}
