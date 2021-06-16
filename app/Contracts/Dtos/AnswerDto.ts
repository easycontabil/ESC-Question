import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAnswerDto {
  static schema = Joi.object({
    content: Joi.string()
      .alphanum()
      .required(),
  })

  @ApiProperty()
  content: string
}

export class UpdateAnswerDto {
  static schema = Joi.object({
    content: Joi.string()
      .alphanum()
      .optional(),
    solved: Joi.boolean().optional(),
    answerReaction: Joi.object({
      liked: Joi.boolean().required(),
    }).optional(),
  })

  @ApiProperty()
  solved?: boolean

  @ApiProperty()
  content?: string

  @ApiProperty({
    example: {
      answerReaction: {
        liked: true,
      },
    },
  })
  answerReaction?: {
    liked: boolean
  }
}
