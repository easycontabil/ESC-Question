import { Options } from 'app/Decorators/Services/Options'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { NotificationRepository } from '../../Repositories/NotificationRepository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Notification } from '../../Models/Notification'

@Injectable()
export class NotificationService {
  @Inject(NotificationRepository)
  private notificationRepository: NotificationRepository

  @Options()
  async findAll(paginate: PaginationContract, options?: ApiRequestContract) {
    return this.notificationRepository.getAll(paginate, options)
  }

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const notification = await this.notificationRepository.getOne(id, options)

    if (!notification) {
      throw new NotFoundException('NOT_FOUND_USER')
    }

    return notification
  }

  async createOne(dto) {
    return this.notificationRepository.storeOne(dto)
  }

  async findOneOrReturn(id: string | Notification) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return model
  }

  async updateOne(id: string | Notification, body?: any) {
    const model = await this.findOneOrReturn(id)

    return this.notificationRepository.updateOne(model, body)
  }

  async deleteOne(id: string) {
    const notification = await this.findOne(id)

    return this.notificationRepository.deleteOne(notification)
  }
}
