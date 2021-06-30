import { CreateDoubtDto, UpdateDoubtDto } from 'app/Contracts/Dtos/DoubtDto'

import { GuardBaseService } from '@secjs/base'
import { Options } from 'app/Decorators/Services/Options'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { DoubtRepository } from 'app/Repositories/DoubtRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { DoubtReactionRepository } from '../../Repositories/DoubtReactionRepository'

@Injectable()
export class DoubtService extends GuardBaseService<any> {
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
    const user = this.guard

    if (
      (
        await this.doubtRepository.getAll(null, {
          isInternRequest: true,
          where: { userId: user.id, solved: false, closedAt: 'null' },
        })
      ).data.length >= 5
    ) {
      throw new BadRequestException(
        'Você só pode conter no máximo 5 dúvidas abertas',
      )
    }

    return this.doubtRepository.storeOne({
      title: dto.title,
      description: dto.description,
      userId: user.id,
    })
  }

  async updateOne(id: string, dto: UpdateDoubtDto) {
    const user = this.guard

    const doubt = await this.findOne(id, {
      includes: [{ relation: 'doubtReactions' }],
    })

    if (dto.doubtReaction) {
      if (doubt.userId === user.id) {
        throw new BadRequestException(
          'Um usuário não pode reagir a sua própria dúvida',
        )
      }

      delete dto.title
      delete dto.description

      const repeatedReaction = await this.doubtReactionRepository.getOne(null, {
        where: {
          doubtId: id,
          userId: user.id,
        },
      })

      if (repeatedReaction) {
        repeatedReaction.liked = dto.doubtReaction.liked

        // await this.answerReactionRepository.save(repeatedReaction)

        doubt.doubtReactions.push(repeatedReaction)
      } else {
        const doubtReaction = await this.doubtReactionRepository.storeOne({
          userId: user.id,
          doubtId: doubt.id,
          liked: dto.doubtReaction.liked,
        })

        doubt.doubtReactions.push(doubtReaction)
      }
    }

    return this.doubtRepository.updateOne(doubt, dto)
  }

  async deleteOne(id: string) {
    const doubt = await this.findOne(id)

    return this.doubtRepository.deleteOne(doubt)
  }
}
