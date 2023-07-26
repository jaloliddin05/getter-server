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
} from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { Public } from '../auth/decorators/public.decorator';
import { userRoles } from '../../infra/shared/enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all tags' })
  @ApiOkResponse({
    description: 'The tags were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.tagService.getAll();
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single tag by id' })
  @ApiOkResponse({
    description: 'The tag was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Tag> {
    return this.tagService.getOne(id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new tag' })
  @ApiCreatedResponse({
    description: 'The tag was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateTagDto) {
    return await this.tagService.create(data);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating tag' })
  @ApiOkResponse({
    description: 'Tag was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdateTagDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.tagService.change(positionData, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting tag' })
  @ApiOkResponse({
    description: 'Tag was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.tagService.deleteOne(id);
  }
}
