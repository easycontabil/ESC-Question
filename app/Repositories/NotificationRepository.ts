import { Notification } from 'app/Models/Notification'
import { EntityRepository } from 'typeorm'
import { Ignore } from 'app/Decorators/Providers/Ignore'
import { TypeOrmRepository } from '@secjs/base/repositories/TypeOrmRepository'

@EntityRepository(Notification)
@Ignore({ onlyFromImports: true })
export class NotificationRepository extends TypeOrmRepository<Notification> {
  protected wheres: [
    'id',
    'title',
    'content',
    'type',
    'status',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  protected relations: ['user']

  protected Model = Notification.name
}
