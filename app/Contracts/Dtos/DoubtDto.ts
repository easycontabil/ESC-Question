import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDoubtDto {
  static schema = Joi.object({
    title: Joi.string()
      .alphanum()
      .required(),
    description: Joi.string().required(),
  })

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string
}

export class UpdateDoubtDto {
  static schema = Joi.object({
    title: Joi.string()
      .alphanum()
      .optional(),
    description: Joi.string()
      .alphanum()
      .optional(),
    doubtReaction: Joi.object({
      liked: Joi.boolean().required(),
    }).optional(),
  })

  @ApiProperty()
  title?: string

  @ApiProperty()
  description?: string

  @ApiProperty({
    example: {
      doubtReaction: {
        liked: true,
      },
    },
  })
  doubtReaction?: {
    liked: boolean
  }
}
