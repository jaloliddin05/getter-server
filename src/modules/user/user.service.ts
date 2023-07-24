import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
import { FileService } from '../file/file.service';
import { PositionService } from '../position/position.service';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../infra/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly connection: DataSource,
    private readonly fileService: FileService,
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
        avatar: true,
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
        avatar: true,
        position: true,
        articles: {
          avatar: true,
          tags: true,
          category: true,
        },
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

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.usersRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateUserDto,
    id: string,
    file: Express.Multer.File,
    req,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, req);
      value.avatar = avatar;
    }

    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(data: CreateUserDto, file: Express.Multer.File, req) {
    try {
      if (file) {
        const avatar = await this.uploadImage(file, req);
        data.avatar = avatar.id;
      }
      data.password = await hashPassword(data.password);
      const position = await this.positionService.getOne(data.position);

      const user = this.usersRepository.create({ ...data, position });

      // await this.mailService.register({
      //   ...user,
      //   password: data.password,
      // });

      return this.usersRepository.save(user);
    } catch (err) {
      if (err?.errno === 1062) {
        throw new Error('This user already exists.');
      }
      throw err;
    }
  }

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getById(id);
    let avatar;
    if (data?.avatar?.id) {
      avatar = await this.fileService.updateFile(data.avatar.id, file, request);
    } else {
      avatar = await this.fileService.uploadFile(file, request);
    }

    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getById(id);
    if (data?.avatar?.id) {
      await this.fileService.removeFile(data.avatar.id);
    }
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
