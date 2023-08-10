import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { PositionService } from '../position/position.service';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../infra/helpers';
import { Article } from '../article/article.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly connection: DataSource,
    private readonly positionService: PositionService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<User>,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      order: {
        name: 'ASC',
      },
      relations: {
        position: true,
      },
    });
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: {
        position: true,
      },
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getUserCategories(id: string) {
    const data = await this.usersRepository.findOne({
      where: { id },
      relations: {
        articles: {
          categories: true,
        },
      },
    });

    return this.getUniqueData(data.articles, 'categories');
  }

  async getUserTags(id: string) {
    const data = await this.usersRepository.findOne({
      where: { id },
      relations: {
        articles: {
          tags: true,
        },
      },
    });

    return this.getUniqueData(data.articles, 'tags');
  }

  async getUniqueData(articles: Article[], prop: string) {
    const res = [];
    for (let article of articles) {
      for (let item of article[prop]) {
        const isExist = res.find((r) => r.id == item.id);
        if (!isExist) {
          res.push(item);
        }
      }
    }
    return res;
  }

  async deleteOne(id: string) {
    const response = await this.usersRepository.delete(id);
    return response;
  }

  async change(value: UpdateUserDto, id: string) {
    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(data: CreateUserDto) {
    const isEmailExist = await this.checkEmail(data.email);

    if (isEmailExist) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }

    data.password = await hashPassword(data.password);
    const position = await this.positionService.getOne(data.position);

    const user = this.usersRepository.create({ ...data, position });

    return this.usersRepository.save(user);
  }

  async checkEmail(email: string) {
    const data = await this.usersRepository.findOne({ where: { email } });
    return data;
  }

  async verifyEmailCode(code: string, hash: string) {
    const isValidCode = await bcrypt.compare(String(code), hash);
    return isValidCode;
  }

  async generateEmailCode(email: string) {
    const code = String(Math.floor(Math.random() * 9000) + 1000);
    const hash = await bcrypt.hash(code, 10);
    await this.mailService.register({ email, code });
    return hash;
  }

  async setTrueEmail(id) {
    const user = await this.getOne(id);
    user.isEmailValid = true;
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(user);
    });
    return user;
  }
}
