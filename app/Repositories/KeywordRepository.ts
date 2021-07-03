import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'
import { Keyword } from '../Models/Keyword'

@EntityRepository(Keyword)
@Ignore({ onlyFromImports: true })
export class KeywordRepository extends TypeOrmRepository<Keyword> {
  protected wheres: ['id', 'name', 'createdAt', 'updatedAt']
  protected relations: ['category']

  protected Model = Keyword.name
}
