import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAnswerDto {
  static schema = Joi.object({
    doubtId: Joi.string().required(),
    content: Joi.string().required(),
    solved: Joi.boolean().optional(),
  })

  @ApiProperty()
  doubtId: string

  @ApiProperty()
  content: string
}

export class UpdateAnswerDto {
  static schema = Joi.object({
    content: Joi.string().optional(),
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
