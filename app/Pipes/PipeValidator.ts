import { Schema } from 'joi'

import { BadRequestException, Injectable } from '@nestjs/common'
import { PipeValidatorContract } from 'app/Contracts/PipeValidatorContract'

@Injectable()
export class PipeValidator<T> implements PipeValidatorContract {
  async transform(value: any, metadata: any) {
    return this.validate(metadata.metatype.schema, value)
  }

  async validate(schema: Schema, value: Partial<T>) {
    const { error } = schema.validate(value, { abortEarly: false })

    if (error) {
      const messages = []
      error.details.forEach(detail => messages.push(detail.message))

      throw new BadRequestException({
        name: 'Validation Error',
        validations: messages,
        statusCode: 400,
      })
    }

    return value
  }
}
