import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateOrderDto, CreateOrderDto } from './dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAll(options: IPaginationOptions, where): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      order: {
        date: 'DESC',
      },
      where,
    });
  }

  async getById(id: string) {
    const article = await this.orderRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteOne(id: string) {
    const response = await this.orderRepository.delete(id);
    return response;
  }

  async change(values: UpdateOrderDto, id: string) {
    const response = await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set(values as unknown as Order)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(values: CreateOrderDto) {
    const response = await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(values as unknown as Order)
      .returning('id')
      .execute();

    return response;
  }
}
