import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import {
  CreateCommentDto,
  UpdateCommentDto,
} from 'app/Contracts/Dtos/CommentDto'

import { PaginationContract } from '@secjs/contracts'
import { PipeValidator } from 'app/Pipes/PipeValidator'
import { CommentService } from 'app/Services/Api/CommentService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  @Inject(CommentService)
  private commentService: CommentService

  @Get()
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.commentService.findAll(paginate, queries)
  }

  @Post()
  async store(@Body(PipeValidator) body: CreateCommentDto) {
    return this.commentService.createOne(body)
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(@Query(QueryParamsPipe) queries: any, @Param() params: any) {
    return this.commentService.findOne(params.id, queries)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  async update(
    @Param() params: any,
    @Body(PipeValidator) body: UpdateCommentDto,
  ) {
    return this.commentService.updateOne(params.id, body)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param() params: any) {
    return this.commentService.deleteOne(params.id)
  }
}
