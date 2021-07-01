import * as Joi from 'joi'
import { Category } from 'app/Models/Category'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  static schema = Joi.object({
    title: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    description: Joi.string()
      .min(10)
      .max(40)
      .required(),
    categoryId: Joi.string().optional(),
  })

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  category?: Category
}

export class UpdateCategoryDto {
  static schema = Joi.object({
    title: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .optional(),
    description: Joi.string()
      .alphanum()
      .min(10)
      .max(40)
      .optional(),
    category: Joi.string()
      .alphanum()
      .optional(),
  })

  @ApiProperty()
  name?: string

  @ApiProperty()
  description?: string

  category?: Category
}
