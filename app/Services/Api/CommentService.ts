import {
  CreateCommentDto,
  UpdateCommentDto,
} from 'app/Contracts/Dtos/CommentDto'

import { Options } from 'app/Decorators/Services/Options'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CommentRepository } from 'app/Repositories/CommentRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'
import { AnswerService } from './AnswerService'
import { DoubtService } from './DoubtService'
import { BaseService } from '../Base/BaseService'
import { NotificationService } from './NotificationService'
import { UserService } from './UserService'

@Injectable()
export class CommentService extends BaseService {
  @Inject(DoubtService)
  private doubtService: DoubtService

  @Inject(NotificationService)
  private notificationService: NotificationService

  @Inject(AnswerService)
  private answerService: AnswerService

  @Inject(UserService)
  private userService: UserService

  @Inject(CommentRepository)
  private commentRepository: CommentRepository

  @Options()
  async findAll(paginate: PaginationContract, options?: ApiRequestContract) {
    return this.commentRepository.getAll(paginate, options)
  }

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const comment = await this.commentRepository.getOne(id, options)

    if (!comment) {
      throw new NotFoundException('NOT_FOUND_COMMENT')
    }

    return comment
  }

  async createOne(dto: CreateCommentDto) {
    const user = this.guard

    if (dto.answerId && dto.doubtId) {
      throw new BadRequestException(
        'Não é possível criar um comentário para uma duvida e pergunta ao mesmo tempo',
      )
    }

    if (dto.answerId) {
      const answer = await this.answerService.findOne(dto.answerId)

      this.notificationService.createOne({
        title: `@${user.email} COMENTOU NA SUA RESPOSTA`,
        content: `O usuário ${user.name} comentou na sua resposta`,
        user: await this.userService.findOne(answer.userId),
        type: 'warn',
      })

      return this.commentRepository.storeOne({
        answer,
        user,
        userId: user.id,
        content: dto.content,
      })
    }

    if (dto.doubtId) {
      const doubt = await this.doubtService.findOne(dto.doubtId)

      return this.commentRepository.storeOne({
        doubt,
        user,
        userId: user.id,
        content: dto.content,
      })
    }
  }

  async updateOne(id: string, dto: UpdateCommentDto) {
    const comment = await this.findOne(id)

    return this.commentRepository.updateOne(comment, dto)
  }

  async deleteOne(id: string) {
    const comment = await this.findOne(id)

    return this.commentRepository.deleteOne(comment)
  }
}
