import { Schema } from 'joi'
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface'

export interface PipeValidatorContract<T = any> {
  /**
   * Method to implement a custom validator pipe. Called with two parameters
   *
   * @param value argument before it is received by route handler method
   * @param metadata contains metadata about the value
   */
  transform(value: T, metadata: ArgumentMetadata): Promise<T>

  /**
   * Method to validate parameters transformed by transform
   *
   * @param schema validation, could be an update or store validation
   * @param value argument before it is received by route handler method
   */
  validate(schema: Schema, value: T | any | any[]): Promise<T>
}
