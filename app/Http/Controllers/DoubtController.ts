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

import { CreateDoubtDto, UpdateDoubtDto } from 'app/Contracts/Dtos/DoubtDto'

import { PaginationContract } from '@secjs/contracts'
import { PipeValidator } from 'app/Pipes/PipeValidator'
import { DoubtService } from 'app/Services/Api/DoubtService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UserGuard } from 'app/Http/Guards/UserGuard'
import { User } from '../../Decorators/Http/User'

@ApiBearerAuth()
@ApiTags('Doubt')
@Controller('doubts')
@UseGuards(UserGuard)
export class DoubtController {
  @Inject(DoubtService)
  private doubtService: DoubtService

  @Get()
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.doubtService.findAll(paginate, queries)
  }

  @Post()
  async store(@User() user, @Body(PipeValidator) body: CreateDoubtDto) {
    return this.doubtService.setGuard(user).createOne(body)
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(@Query(QueryParamsPipe) queries: any, @Param() params: any) {
    return this.doubtService.findOne(params.id, queries)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  async update(
    @User() user,
    @Param() params: any,
    @Body(PipeValidator) body: UpdateDoubtDto,
  ) {
    return this.doubtService.setGuard(user).updateOne(params.id, body)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param() params: any) {
    return this.doubtService.deleteOne(params.id)
  }
}
