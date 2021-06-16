import { Category } from 'app/Models/Category'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Category)
@Ignore({ onlyFromImports: true })
export class CategoryRepository extends TypeOrmRepository<Category> {
  protected wheres: ['id', 'name', 'description', 'createdAt', 'updatedAt']
  protected relations: ['doubt', 'category', 'keywords']

  protected Model = new Category()
}
