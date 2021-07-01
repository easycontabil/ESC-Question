import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  static schema = Joi.object({
    answerId: Joi.string().required(),
    content: Joi.string().required(),
  })

  @ApiProperty()
  answerId: string

  @ApiProperty()
  content: string
}

export class UpdateCommentDto {
  static schema = Joi.object({
    content: Joi.string()
      .alphanum()
      .optional(),
  })

  @ApiProperty()
  content?: string
}
