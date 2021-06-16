import { Doubt } from 'app/Models/Doubt'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Doubt)
@Ignore({ onlyFromImports: true })
export class DoubtRepository extends TypeOrmRepository<Doubt> {
  protected wheres: ['id', 'title', 'description', 'createdAt', 'updatedAt']
  protected relations: ['answers', 'categories', 'doubtReactions']

  protected Model = new Doubt()
}
