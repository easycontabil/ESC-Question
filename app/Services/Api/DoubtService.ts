import { CreateDoubtDto, UpdateDoubtDto } from 'app/Contracts/Dtos/DoubtDto'
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
import { CategoryRepository } from '../../Repositories/CategoryRepository'
import { BaseService } from '../Base/BaseService'
import { NotificationService } from './NotificationService'
import { UserService } from './UserService'

@Injectable()
export class DoubtService extends BaseService {
  @Inject(DoubtRepository)
  private doubtRepository: DoubtRepository

  @Inject(UserService)
  private userService: UserService

  @Inject(CategoryRepository)
  private categoryRepository: CategoryRepository

  @Inject(NotificationService)
  private notificationService: NotificationService

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

    if (dto.categories) {
      for (const i in dto.categories) {
        const category = await this.categoryRepository.getOne(dto.categories[i])

        if (!category) {
          throw new BadRequestException(
            'Uma das categorias passadas não foi encontrada',
          )
        }

        dto.categories[i] = category
      }
    }

    this.notificationService.createOne({
      user,
      title: `VOCÊ CRIOU UMA NOVA DÚVIDA`,
      content: `Uma nova dúvida foi criada na sua conta`,
      type: 'warn',
    })

    this.userService.updateOne(user.id, { nmrDuvidas: user.nmrDuvidas + 1 })

    return this.doubtRepository.storeOne({
      title: dto.title,
      description: dto.description,
      user,
      userId: user.id,
      categories: dto.categories,
    })
  }

  async updateOne(id: string, dto: UpdateDoubtDto) {
    const user = this.guard

    const doubt = await this.findOne(id, {
      includes: [
        { relation: 'user' },
        { relation: 'doubtReactions', includes: [{ relation: 'user' }] },
        {
          relation: 'answers',
          includes: [
            { relation: 'answerReactions', includes: [{ relation: 'user' }] },
            { relation: 'comments', includes: [{ relation: 'user' }] },
          ],
        },
      ],
    })

    if (dto.solved) {
      await this.userService.updateOne(doubt.user.id, {
        nmrResolucoes: doubt.user.nmrResolucoes + 1,
      })

      await this.notificationService.createOne({
        title: `VOCÊ RESOLVEU A SUA PRÓPRIA DÚVIDA`,
        content: `Você marcou sua dúvida como resolvida`,
        user: await this.userService.findOne(doubt.userId),
        type: 'success',
      })

      return this.doubtRepository.updateOne(doubt, {
        solved: dto.solved,
      })
    }

    if (dto.open) {
      return this.doubtRepository.updateOne(doubt, { closedAt: null })
    }

    if (dto.close) {
      return this.doubtRepository.updateOne(doubt, { closedAt: new Date() })
    }

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
        await this.doubtReactionRepository.updateOne(repeatedReaction, {
          liked: dto.doubtReaction.liked,
        })

        const doubtIndex = doubt.doubtReactions.findIndex(
          doubt => doubt.id === repeatedReaction.id,
        )

        doubt.doubtReactions.splice(doubtIndex, 1)

        doubt.doubtReactions.push(repeatedReaction)
      } else {
        const doubtReaction = await this.doubtReactionRepository.storeOne({
          user,
          userId: user.id,
          doubtId: doubt.id,
          liked: dto.doubtReaction.liked,
        })

        doubt.doubtReactions.push(doubtReaction)
      }

      this.notificationService.createOne({
        title: `@${user.email} ${
          dto.doubtReaction.liked ? 'CURTIU' : 'NÃO CURTIU'
        } SUA DÚVIDA`,
        content: `O usuário ${user.name} ${
          dto.doubtReaction.liked ? 'curtiu' : 'não curtiu'
        } a sua dúvida`,
        user: doubt.user,
        type: dto.doubtReaction.liked ? 'success' : 'error',
      })
    }

    delete dto.open
    delete dto.close
    delete dto.doubtReaction

    return this.doubtRepository.updateOne(doubt, dto)
  }

  async deleteOne(id: string) {
    const doubt = await this.findOne(id)

    return this.doubtRepository.deleteOne(doubt)
  }
}
