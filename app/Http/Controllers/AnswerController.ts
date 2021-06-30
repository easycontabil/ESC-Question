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
  UseGuards,
} from '@nestjs/common'

import { PaginationContract } from '@secjs/contracts'
import { PipeValidator } from 'app/Pipes/PipeValidator'
import { AnswerService } from 'app/Services/Api/AnswerService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateAnswerDto, UpdateAnswerDto } from 'app/Contracts/Dtos/AnswerDto'
import { UserGuard } from '../Guards/UserGuard'
import { User } from '../../Decorators/Http/User'

@ApiTags('Answer')
@Controller('answers')
@UseGuards(UserGuard)
export class AnswerController {
  @Inject(AnswerService)
  private answerService: AnswerService

  @Get()
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.answerService.findAll(paginate, queries)
  }

  @Post()
  async store(@User() user, @Body(PipeValidator) body: CreateAnswerDto) {
    return this.answerService.setGuard(user).createOne(body)
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(@Query(QueryParamsPipe) queries: any, @Param() params: any) {
    return this.answerService.findOne(params.id, queries)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  async update(
    @User() user,
    @Param() params: any,
    @Body(PipeValidator) body: UpdateAnswerDto,
  ) {
    return this.answerService.setGuard(user).updateOne(params.id, body)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param() params: any) {
    return this.answerService.deleteOne(params.id)
  }
}
