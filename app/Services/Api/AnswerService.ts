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
import { GuardCollection } from '../Collections/GuardCollection'
import { UserService } from './UserService'
import { NotificationService } from './NotificationService'

@Injectable()
export class AnswerService extends BaseService {
  @Inject(DoubtService)
  private doubtService: DoubtService

  @Inject(UserService)
  private userService: UserService

  @Inject(GuardCollection)
  private guardCollection: GuardCollection

  @Inject(AnswerRepository)
  private answerRepository: AnswerRepository

  @Inject(NotificationService)
  private notificationService: NotificationService

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

    this.notificationService.createOne({
      title: `VOCÊ RESPONDEU UMA DÚVIDA`,
      content: `Uma nova resposta foi criada`,
      user,
      type: 'warn',
    })

    this.notificationService.createOne({
      title: `@${user.email} RESPONDEU SUA DÚVIDA`,
      content: `O usuário ${user.name} respondeu a sua dúvida`,
      user: await this.userService.findOne(doubt.userId),
      type: 'warn',
    })

    this.userService.updateOne(user.id, { nmrRespostas: user.nmrRespostas + 1 })

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
      includes: [
        { relation: 'user' },
        { relation: 'comments', includes: [{ relation: 'user' }] },
        { relation: 'answerReactions', includes: [{ relation: 'user' }] },
      ],
    })

    if (dto.solved) {
      const doubt = await this.doubtService
        .setGuard(user)
        .updateOne(answer.doubtId, {
          solved: dto.solved,
        })

      // pontos dono duvida
      await this.userService.updateOne(doubt.user, {
        points: 10,
      })

      // pontos dono resposta
      await this.userService.updateOne(answer.user, {
        points: 20,
      })

      const doubtUser = await this.userService.findOne(doubt.userId)

      this.notificationService.createOne({
        title: `@${user.email} RESOLVEU A SUA DÚVIDA`,
        content: `O usuário ${user.name} resolveu a sua dúvida`,
        user: doubtUser,
        type: 'success',
      })

      this.notificationService.createOne({
        title: `VOCÊ RESOLVEU UMA DÚVIDA`,
        content: `Você resolveu a dúvida do usuário ${doubtUser.name}`,
        user,
        type: 'success',
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
          answerId: answer.id,
          liked: dto.answerReaction.liked,
        })

        answer.answerReactions.push(answerReaction)
      }

      this.notificationService.createOne({
        title: `@${user.email} ${
          dto.answerReaction.liked ? 'CURTIU' : 'NÃO CURTIU'
        } SUA RESPOSTA`,
        content: `O usuário ${user.name} ${
          dto.answerReaction.liked ? 'curtiu' : 'não curtiu'
        } a sua resposta`,
        user: await this.userService.findOne(answer.userId),
        type: dto.answerReaction.liked ? 'success' : 'error',
      })
    }

    delete dto.answerReaction

    return this.answerRepository.updateOne(answer, dto)
  }

  async deleteOne(id: string) {
    const answer = await this.findOne(id)

    return this.answerRepository.deleteOne(answer)
  }
}
