import * as Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  static schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    description: Joi.string()
      .min(10)
      .max(40)
      .required(),
    keywords: Joi.array().optional(),
  })

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  keywords?: any[]
}

export class UpdateCategoryDto {
  static schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .optional(),
    description: Joi.string()
      .min(10)
      .max(40)
      .optional(),
    keywords: Joi.array().optional(),
  })

  @ApiProperty()
  name?: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  keywords?: any[]
}
