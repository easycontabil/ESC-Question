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
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'app/Contracts/Dtos/CategoryDto'

import { PaginationContract } from '@secjs/contracts'
import { PipeValidator } from 'app/Pipes/PipeValidator'
import { CategoryService } from 'app/Services/Api/CategoryService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  @Inject(CategoryService)
  private categoryService: CategoryService

  @Get()
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.categoryService.findAll(paginate, queries)
  }

  @Post()
  async store(@Body(PipeValidator) body: CreateCategoryDto) {
    return this.categoryService.createOne(body)
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  async show(@Query(QueryParamsPipe) queries: any, @Param() params: any) {
    return this.categoryService.findOne(params.id, queries)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  async update(
    @Param() params: any,
    @Body(PipeValidator) body: UpdateCategoryDto,
  ) {
    return this.categoryService.updateOne(params.id, body)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param() params: any) {
    return this.categoryService.deleteOne(params.id)
  }
}
