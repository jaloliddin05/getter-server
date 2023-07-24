import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Patch,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateArticleDto, UpdateArticleDto } from './dto';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { MulterStorage } from '../../infra/helpers';
import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all articles' })
  @ApiOkResponse({
    description: 'The articles were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    let where;
    if (query.isActive == 'true') {
      where = { isActive: true };
    } else if (query.isActive == 'false') {
      where = { isActive: false };
    } else {
      where = {};
    }
    return await this.articleService.getAll(
      { limit: query.limit, page: query.page, route },
      where,
    );
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single article by id' })
  @ApiOkResponse({
    description: 'The article was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Req() { cookies }): Promise<{ data }> {
    return this.articleService.getOne(id, cookies);
  }

  @Public()
  @Get('/category/:id')
  @ApiOperation({ summary: 'Method: returns  articles by category id' })
  @ApiOkResponse({
    description: 'The articles was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getArticleByCategoryId(@Param('id') id: string): Promise<Article[]> {
    return this.articleService.getByCategoryId(id);
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new article' })
  @ApiCreatedResponse({
    description: 'The article was created successfully',
  })
  @UseInterceptors(
    FilesInterceptor('avatar', 2, {
      storage: MulterStorage('uploads/image/article'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFiles() files,
    @Body() data: CreateArticleDto,
    @Req() request,
  ): Promise<InsertResult | Article> {
    return await this.articleService.create(data, files, request);
  }

  @Post('/avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new article avatar' })
  @ApiCreatedResponse({
    description: 'The article avatar was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/article'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadAvatar(
    @UploadedFile() file,
    @Param('id') id: string,
    @Req() request,
  ): Promise<InsertResult | Article> {
    return await this.articleService.uploadAvatar(id, file, request);
  }

  @Post('/add-like/:articleId')
  @ApiOperation({ summary: 'Method: adds like to article' })
  @ApiCreatedResponse({
    description: 'The like added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addLikeToArticle(
    @Req() request,
    @Param('articleId') articleId: string,
  ): Promise<Article> {
    return await this.articleService.addLikeToArticle({
      userId: request.user.id,
      articleId,
    });
  }

  @Post('/remove-like/:articleId')
  @ApiOperation({ summary: 'Method: removes like from article' })
  @ApiCreatedResponse({
    description: 'The like removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeLikeFromArticle(
    @Req() request,
    @Param('articleId') articleId: string,
  ): Promise<Article> {
    return await this.articleService.removeLikeFromArticle({
      userId: request.user.id,
      articleId,
    });
  }

  @Post('/add-tag')
  @ApiOperation({ summary: 'Method: adds tag to article' })
  @ApiCreatedResponse({
    description: 'The tag added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addTagToArticle(
    @Body() data: { articleId: string; tagId: string },
  ): Promise<Article> {
    return await this.articleService.addTagToArticle(data);
  }

  @Post('/remove-tag')
  @ApiOperation({ summary: 'Method: removes tag from article' })
  @ApiCreatedResponse({
    description: 'The tag removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeTagFromArticle(
    @Body() data: { articleId: string; tagId: string },
  ): Promise<Article> {
    return await this.articleService.removeTagFromArticle(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating article' })
  @ApiOkResponse({
    description: 'Article was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateArticleDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Article> {
    return await this.articleService.change(data, id);
  }

  @Patch('/avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating article avatar' })
  @ApiOkResponse({
    description: 'Article avatar was changed',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: MulterStorage('uploads/image/article'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeImage(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Param('id') id: string,
    @Req() request,
  ) {
    return await this.articleService.updateAvatar(id, file, request);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/isActive/:id')
  @ApiOperation({ summary: 'Method: updating article isActive' })
  @ApiOkResponse({
    description: 'Article active was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(
    @Body() data: { isActive: boolean },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.articleService.changeIsActive(data.isActive, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting article' })
  @ApiOkResponse({
    description: 'Article was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    return await this.articleService.deleteOne(id);
  }
}
