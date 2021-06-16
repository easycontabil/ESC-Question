import { CreateDoubtDto, UpdateDoubtDto } from 'app/Contracts/Dtos/DoubtDto'

import { Options } from 'app/Decorators/Services/Options'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { DoubtRepository } from 'app/Repositories/DoubtRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { DoubtReactionRepository } from '../../Repositories/DoubtReactionRepository'

@Injectable()
export class DoubtService {
  @Inject(DoubtRepository)
  private doubtRepository: DoubtRepository

  @Inject(DoubtReactionRepository)
  private doubtReactionRepository: DoubtReactionRepository

  @Options()
  async findAll(paginate: PaginationContract, options?: ApiRequestContract) {
    return this.doubtRepository.getAll(paginate, options)
  }

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const doubt = await this.doubtRepository.getOne(id, options)

    if (!doubt) {
      throw new NotFoundException('NOT_FOUND_DOUBT')
    }

    return doubt
  }

  async createOne(dto: CreateDoubtDto) {
    return this.doubtRepository.storeOne(dto)
  }

  async updateOne(id: string, dto: UpdateDoubtDto) {
    const doubt = await this.findOne(id, {
      includes: [{ relation: 'doubtReactions' }],
    })

    if (dto.doubtReaction) {
      delete dto.title
      delete dto.description

      const answerReaction = await this.doubtReactionRepository.storeOne({
        liked: dto.doubtReaction.liked,
      })

      doubt.doubtReactions.push(answerReaction)
    }

    return this.doubtRepository.updateOne(doubt, dto)
  }

  async deleteOne(id: string) {
    const doubt = await this.findOne(id)

    return this.doubtRepository.deleteOne(doubt)
  }
}
