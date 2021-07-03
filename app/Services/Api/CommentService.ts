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
import { GuardBaseService } from '@secjs/base/services/GuardBaseService'
import { AnswerService } from './AnswerService'
import { DoubtService } from './DoubtService'

@Injectable()
export class CommentService extends GuardBaseService<any> {
  @Inject(DoubtService)
  private doubtService: DoubtService

  @Inject(AnswerService)
  private answerService: AnswerService

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

      return this.commentRepository.storeOne({
        answer,
        userId: user.id,
        content: dto.content,
      })
    }

    if (dto.doubtId) {
      const doubt = await this.doubtService.findOne(dto.doubtId)

      return this.commentRepository.storeOne({
        doubt,
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
