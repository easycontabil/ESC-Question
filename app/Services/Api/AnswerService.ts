import { CreateAnswerDto, UpdateAnswerDto } from 'app/Contracts/Dtos/AnswerDto'

import { Options } from 'app/Decorators/Services/Options'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { AnswerRepository } from 'app/Repositories/AnswerRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { AnswerReactionRepository } from '../../Repositories/AnswerReactionRepository'
import { DoubtService } from './DoubtService'
import { BaseService } from '../Base/BaseService'

@Injectable()
export class AnswerService extends BaseService {
  @Inject(DoubtService)
  private doubtService: DoubtService

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
    const user = this.guard

    const doubt = await this.doubtService.findOne(dto.doubtId)

    if (doubt.userId === user.id) {
      throw new BadRequestException(
        'Um usuário não pode responder a própria dúvida',
      )
    }

    const respostaRepetida = await this.answerRepository.getOne(null, {
      where: {
        userId: user.id,
        doubtId: doubt.id,
      },
    })

    if (respostaRepetida) {
      throw new BadRequestException(
        'Um usuário não pode responder mais de uma vez a mesma dúvida',
      )
    }

    return this.answerRepository.storeOne({
      user,
      doubt,
      userId: user.id,
      content: dto.content,
    })
  }

  async updateOne(id: string, dto: UpdateAnswerDto) {
    const user = this.guard

    const answer = await this.findOne(id, {
      includes: [{ relation: 'answerReactions' }],
    })

    if (dto.solved) {
      await this.doubtService.setGuard(user).updateOne(answer.doubtId, {
        solved: dto.solved,
        closedAt: new Date(),
      })

      return this.answerRepository.updateOne(answer, { solved: dto.solved })
    }

    if (dto.answerReaction) {
      if (answer.userId === user.id) {
        throw new BadRequestException(
          'Um usuário não pode reagir a sua própria resposta',
        )
      }

      delete dto.solved
      delete dto.content

      const repeatedReaction = await this.answerReactionRepository.getOne(
        null,
        {
          where: {
            answerId: id,
            userId: user.id,
          },
        },
      )

      if (repeatedReaction) {
        await this.answerReactionRepository.updateOne(repeatedReaction, {
          liked: dto.answerReaction.liked,
        })

        const answerIndex = answer.answerReactions.findIndex(
          answer => answer.id === repeatedReaction.id,
        )

        answer.answerReactions.splice(answerIndex, 1)

        answer.answerReactions.push(repeatedReaction)
      } else {
        const answerReaction = await this.answerReactionRepository.storeOne({
          user,
          userId: user.id,
          answerId: answer.id,
          liked: dto.answerReaction.liked,
        })

        answer.answerReactions.push(answerReaction)
      }
    }

    delete dto.answerReaction

    return this.answerRepository.updateOne(answer, dto)
  }

  async deleteOne(id: string) {
    const answer = await this.findOne(id)

    return this.answerRepository.deleteOne(answer)
  }
}
