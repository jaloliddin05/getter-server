import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateWebsiteDto, CreateWebsiteDto, LikeDto } from './dto';
import { Website } from './website.entity';
import { UsersService } from '../user/user.service';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(Website)
    private readonly websiteRepository: Repository<Website>,
    private readonly connection: DataSource,
    private readonly userService: UsersService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where,
  ): Promise<Pagination<Website>> {
    return paginate<Website>(this.websiteRepository, options, {
      order: {
        date: 'DESC',
      },
      where,
    });
  }

  async getById(id: string, cookie?) {
    const website = await this.websiteRepository.findOne({
      relations: {
        likes: true,
      },
      where: { id },
    });

    if (!website) {
      throw new HttpException('Website not found', HttpStatus.NOT_FOUND);
    }
    if (cookie.user_id) {
      const isLiked = website.likes.find((u) => u.id == cookie.user_id);
      if (isLiked) {
        return { data: { ...website, isLiked: true } };
      } else {
        return { data: { ...website, isLiked: false } };
      }
    }

    return { data: { ...website, isLiked: false } };
  }

  async getOne(id: string) {
    const website = await this.websiteRepository.findOne({
      relations: {
        likes: true,
      },
      where: { id },
    });

    if (!website) {
      throw new HttpException('Website not found', HttpStatus.NOT_FOUND);
    }
    return website;
  }

  async deleteOne(id: string) {
    const response = await this.websiteRepository.delete(id);
    return response;
  }

  async change(values: UpdateWebsiteDto, id: string) {
    const response = await this.websiteRepository
      .createQueryBuilder()
      .update(Website)
      .set(values as unknown as Website)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async changeIsActive(isActive: boolean, id: string) {
    const data = await this.websiteRepository.update(id, { isActive });
    return data;
  }

  async create(value: CreateWebsiteDto) {
    const response = this.websiteRepository.create(value);
    return await this.websiteRepository.save(response);
  }

  async addLikeToWebsite(values: LikeDto) {
    const website = await this.getOne(values.websiteId);
    const user = await this.userService.getById(values.userId);

    website.likes = website.likes || [];
    website.likes.push(user);
    website.likesCount = website.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(website);
    });
    return website;
  }

  async removeLikeFromWebsite(values: LikeDto) {
    const website = await this.getOne(values.websiteId);

    website.likes = website.likes || [];
    website.likes = website.likes.filter((u) => u.id != values.userId);
    website.likesCount = website.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(website);
    });
    return website;
  }
}
