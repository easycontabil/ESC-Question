import { Options } from 'app/Decorators/Services/Options'
import { ApiRequestContract } from '@secjs/contracts'
import { UserRepository } from '../../Repositories/UserRepository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '../../Models/User'

@Injectable()
export class UserService {
  @Inject(UserRepository)
  private userRepository: UserRepository

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const user = await this.userRepository.getOne(id, options)

    if (!user) {
      throw new NotFoundException('NOT_FOUND_USER')
    }

    return user
  }

  async findOneOrReturn(id: string | User) {
    let model = id

    if (typeof id === 'string') {
      model = await this.findOne(id)
    }

    return model
  }

  async updateOne(id: string | User, body?: any) {
    const model = await this.findOneOrReturn(id)

    return this.userRepository.updateOne(model, body)
  }
}
