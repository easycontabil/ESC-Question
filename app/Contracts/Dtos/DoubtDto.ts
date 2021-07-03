import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDoubtDto {
  static schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    categories: Joi.array().optional(),
  })

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  categories: any[]
}

export class UpdateDoubtDto {
  static schema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    doubtReaction: Joi.object({
      liked: Joi.boolean().required(),
    }).optional(),
    open: Joi.boolean().optional(),
    close: Joi.boolean().optional(),
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

  @ApiProperty()
  open?: boolean

  @ApiProperty()
  close?: boolean

  solved?: boolean
  closedAt?: Date
}
