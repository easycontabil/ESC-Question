import { Doubt } from 'app/Models/Doubt'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Doubt)
@Ignore({ onlyFromImports: true })
export class KeywordRepository extends TypeOrmRepository<Doubt> {
  protected wheres: ['id', 'name', 'createdAt', 'updatedAt']
  protected relations: ['category']

  protected Model = Doubt.name
}
