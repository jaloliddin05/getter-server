import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './category.entity';
import { CategoryEnum } from '../../infra/shared/enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(type: CategoryEnum) {
    return this.categoryRepository.find({ where: { type } });
  }

  async getById(id: string) {
    const category = await this.categoryRepository.findOne({
      relations: {
        articles: {
          user: true,
        },
      },
      where: { id },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async getMoreByIds(ids: string[]) {
    const data = await this.categoryRepository
      .createQueryBuilder()
      .where('id IN(:...ids)', { ids })
      .getMany();
    return data;
  }

  async delete(id: string) {
    const response = await this.categoryRepository.delete(id);
    return response;
  }

  async update(value: UpdateCategoryDto, id: string) {
    const response = await this.categoryRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCategoryDto) {
    const data = this.categoryRepository.create(value);
    return await this.categoryRepository.save(data);
  }
}
