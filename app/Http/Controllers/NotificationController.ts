import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'

import { PaginationContract } from '@secjs/contracts'
import { NotificationService } from 'app/Services/Api/NotificationService'
import { QueryParamsPipe } from 'app/Pipes/QueryParamsPipe'
import { Pagination } from 'app/Decorators/Http/Pagination'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UserGuard } from '../Guards/UserGuard'

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notifications')
@UseGuards(UserGuard)
export class NotificationController {
  @Inject(NotificationService)
  private notificationService: NotificationService

  @Get()
  @ApiQuery({ name: 'limit', allowEmptyValue: true })
  @ApiQuery({ name: 'page', allowEmptyValue: true })
  async index(
    @Query(QueryParamsPipe) queries: any,
    @Pagination() paginate: PaginationContract,
  ) {
    return this.notificationService.findAll(paginate, queries)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delete(@Param() params: any) {
    return this.notificationService.deleteOne(params.id)
  }
}
