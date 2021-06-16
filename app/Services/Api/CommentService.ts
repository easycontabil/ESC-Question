import {
  CreateCommentDto,
  UpdateCommentDto,
} from 'app/Contracts/Dtos/CommentDto'

import { Options } from 'app/Decorators/Services/Options'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CommentRepository } from 'app/Repositories/CommentRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'

@Injectable()
export class CommentService {
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
    return this.commentRepository.storeOne(dto)
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
