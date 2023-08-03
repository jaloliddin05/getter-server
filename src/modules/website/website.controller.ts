import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
  Param,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateWebsiteDto, LikeDto, UpdateWebsiteDto } from './dto';
import { Website } from './website.entity';
import { WebsiteService } from './website.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { MulterStorage } from '../../infra/helpers';
import { FileUploadValidationForUpdate } from '../../infra/validators';
import { Public } from '../auth/decorators/public.decorator';
import { userRoles } from '../../infra/shared/enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all websites' })
  @ApiOkResponse({
    description: 'The websites were returned successfully',
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
    return await this.websiteService.getAll(
      { limit: query.limit, page: query.page, route },
      where,
    );
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single website by id' })
  @ApiOkResponse({
    description: 'The website was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Req() { cookies }): Promise<{ data }> {
    return this.websiteService.getById(id, cookies);
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new website' })
  @ApiCreatedResponse({
    description: 'The website was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateWebsiteDto): Promise<Website> {
    return await this.websiteService.create(data);
  }

  @Post('/add-like/:websiteId')
  @ApiOperation({ summary: 'Method: adds like to website' })
  @ApiCreatedResponse({
    description: 'The like added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addLikeToArticle(
    @Req() request,
    @Param('websiteId') id: string,
  ): Promise<Website> {
    return await this.websiteService.addLikeToWebsite({
      websiteId: id,
      userId: request.user.id,
    });
  }

  @Post('/remove-like/:websiteId')
  @ApiOperation({ summary: 'Method: removes like from website' })
  @ApiCreatedResponse({
    description: 'The like removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeLikeFromArticle(
    @Req() request,
    @Param('websiteId') id: string,
  ): Promise<Website> {
    return await this.websiteService.removeLikeFromWebsite({
      websiteId: id,
      userId: request.user.id,
    });
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating website' })
  @ApiOkResponse({
    description: 'Website was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateWebsiteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Website> {
    return await this.websiteService.change(data, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/isActive/:id')
  @ApiOperation({ summary: 'Method: updating website isActive' })
  @ApiOkResponse({
    description: 'Website active was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(
    @Body() data: { isActive: boolean },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.websiteService.changeIsActive(data.isActive, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting website' })
  @ApiOkResponse({
    description: 'Website was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    return await this.websiteService.deleteOne(id);
  }
}
