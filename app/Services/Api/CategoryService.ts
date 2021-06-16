import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'app/Contracts/Dtos/CategoryDto'

import { Options } from 'app/Decorators/Services/Options'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CategoryRepository } from 'app/Repositories/CategoryRepository'
import { ApiRequestContract, PaginationContract } from '@secjs/contracts'

@Injectable()
export class CategoryService {
  @Inject(CategoryRepository)
  private categoryRepository: CategoryRepository

  @Options()
  async findAll(paginate: PaginationContract, options?: ApiRequestContract) {
    return this.categoryRepository.getAll(paginate, options)
  }

  @Options()
  async findOne(id: string, options?: ApiRequestContract) {
    const category = await this.categoryRepository.getOne(id, options)

    if (!category) {
      throw new NotFoundException('NOT_FOUND_CATEGORY')
    }

    return category
  }

  async createOne(dto: CreateCategoryDto) {
    return this.categoryRepository.storeOne(dto)
  }

  async updateOne(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id)

    return this.categoryRepository.updateOne(category, dto)
  }

  async deleteOne(id: string) {
    const category = await this.findOne(id)

    return this.categoryRepository.deleteOne(category)
  }
}
