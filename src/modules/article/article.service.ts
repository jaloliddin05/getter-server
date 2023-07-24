import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateArticleDto, CreateArticleDto, LikeArticleDto } from './dto';
import { FileService } from '../file/file.service';
import { Article } from './article.entity';
import { UsersService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
    private readonly userService: UsersService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where,
  ): Promise<Pagination<Article>> {
    return paginate<Article>(this.articleRepository, options, {
      order: {
        date: 'DESC',
      },
      relations: {
        user: {
          avatar: true,
          position: true,
        },
        avatar: true,
      },
      where,
    });
  }

  async getOne(id: string, cookie?) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: {
          avatar: true,
          position: true,
        },
        comments: {
          user: {
            avatar: true,
            position: true,
          },
          repliedComments: {
            user: {
              avatar: true,
            },
          },
        },
        avatar: true,
        likes: true,
        category: true,
      },
      where: { id },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    if (cookie.user_id) {
      const isLiked = article.likes.find((u) => u.id == cookie.user_id);
      if (isLiked) {
        return { data: { ...article, isLiked: true } };
      } else {
        return { data: { ...article, isLiked: false } };
      }
    }

    return { data: { ...article, isLiked: false } };
  }

  async getById(id: string) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: true,
        comments: {
          user: true,
        },
        avatar: true,
        likes: true,
        tags: true,
      },
      where: { id },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async getByCategoryId(id: string) {
    const articles = await this.articleRepository.find({
      relations: {
        user: {
          avatar: true,
          position: true,
        },
        avatar: true,
      },
      where: {
        category: { id },
        isActive: true,
      },
    });

    return articles;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.articleRepository.delete(id);
    return response;
  }

  async change(values: UpdateArticleDto, id: string) {
    const response = await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set(values as unknown as Article)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async changeIsActive(isActive: boolean, id: string) {
    const data = await this.articleRepository.update(id, { isActive });
    return data;
  }

  async create(
    values: CreateArticleDto,
    files: Express.Multer.File[],
    request,
  ) {
    if (files.length) {
      values.avatar = [];
      for (let file of files) {
        const avatar = await this.uploadImage(file, request);
        values.avatar.push(avatar);
      }
    }

    const category = await this.categoryService.getMoreByIds(values.categories);
    const user = await this.userService.getById(values.user);
    const tags = await this.tagService.getMoreByIds(values.tags);
    const response = this.articleRepository.create({
      ...values,
      user,
      category,
      tags,
    });

    return await this.articleRepository.save(response);
  }

  async addLikeToArticle(values: LikeArticleDto) {
    const article = await this.getById(values.articleId);
    const user = await this.userService.getById(values.userId);

    article.likes = article.likes || [];
    article.likes.push(user);
    article.likesCount = article.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(article);
    });
    return article;
  }

  async removeLikeFromArticle(values: LikeArticleDto) {
    const article = await this.getById(values.articleId);

    article.likes = article.likes || [];
    article.likes = article.likes.filter((u) => u.id != values.userId);
    article.likesCount = article.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(article);
    });
    return article;
  }

  async addTagToArticle(values: { articleId: string; tagId: string }) {
    const article = await this.getById(values.articleId);
    const tag = await this.tagService.getOne(values.tagId);
    article.tags.push(tag);

    await this.articleRepository.save(article);

    return article;
  }

  async removeTagFromArticle(values: { articleId: string; tagId: string }) {
    const article = await this.getById(values.articleId);

    article.tags = article.tags.length
      ? article.tags.filter((t) => t.id != values.tagId)
      : [];

    await this.articleRepository.save(article);

    return article;
  }

  async updateAvatar(id: string, file: Express.Multer.File, req) {
    await this.updateImage(file, id, req);
  }

  async uploadAvatar(id: string, file: Express.Multer.File, req) {
    const avatar = await this.uploadImage(file, req);
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { avatar: true },
    });
    article.avatar.push(avatar);
    return await this.articleRepository.save(article);
  }

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const avatar = await this.fileService.updateFile(id, file, request);
    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getById(id);
    if (data?.avatar?.length) {
      for (let avatar of data?.avatar) {
        await this.fileService.removeFile(avatar.id);
      }
    }
  }
}
