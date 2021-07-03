import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  static schema = Joi.object({
    answerId: Joi.string().optional(),
    doubtId: Joi.string().optional(),
    content: Joi.string().required(),
  })

  @ApiProperty()
  answerId: string

  @ApiProperty()
  doubtId: string

  @ApiProperty()
  content: string
}

export class UpdateCommentDto {
  static schema = Joi.object({
    content: Joi.string().optional(),
  })

  @ApiProperty()
  content?: string
}
