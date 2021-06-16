import { CreateAnswerDto, UpdateAnswerDto } from 'app/Contracts/Dtos/AnswerDto'

import { Options } from 'app/Decorators/Services/Options'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { AnswerRepository } from 'app/Repositories/AnswerRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { AnswerReactionRepository } from '../../Repositories/AnswerReactionRepository'

@Injectable()
export class AnswerService {
  @Inject(AnswerRepository)
  private answerRepository: AnswerRepository

  @Inject(AnswerReactionRepository)
  private answerReactionRepository: AnswerReactionRepository

  @Options()
  async findAll(paginate: PaginationContract, options?: ApiRequestContract) {
    return this.answerRepository.getAll(paginate, options)
  }

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const answer = await this.answerRepository.getOne(id, options)

    if (!answer) {
      throw new NotFoundException('NOT_FOUND_ANSWER')
    }

    return answer
  }

  async createOne(dto: CreateAnswerDto) {
    return this.answerRepository.storeOne(dto)
  }

  async updateOne(id: string, dto: UpdateAnswerDto) {
    const answer = await this.findOne(id, {
      includes: [{ relation: 'answerReactions' }],
    })

    if (dto.answerReaction) {
      delete dto.solved
      delete dto.content

      const answerReaction = await this.answerReactionRepository.storeOne({
        liked: dto.answerReaction.liked,
      })

      answer.answerReactions.push(answerReaction)
    }

    return this.answerRepository.updateOne(answer, dto)
  }

  async deleteOne(id: string) {
    const answer = await this.findOne(id)

    return this.answerRepository.deleteOne(answer)
  }
}
