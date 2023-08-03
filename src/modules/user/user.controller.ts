import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Get,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { Public } from '../auth/decorators/public.decorator';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Method: returns current user' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request) {
    return this.usersService.getOne(request.user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns user by id' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.usersService.getOne(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all users' })
  @ApiOkResponse({
    description: 'The users were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.usersService.getAll({ ...query, route });
  }

  @Public()
  @Get('/category/:userId')
  @ApiOperation({ summary: 'Method: returns user article categories' })
  @ApiOkResponse({
    description: 'The user articles categories returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getUserCategories(@Param('userId') userId: string) {
    return await this.usersService.getUserCategories(userId);
  }

  @Public()
  @Get('/tag/:userId')
  @ApiOperation({ summary: 'Method: returns  user article tags' })
  @ApiOkResponse({
    description: 'The user articles tags returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getUserTags(@Param('userId') userId: string) {
    return await this.usersService.getUserTags(userId);
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new user' })
  @ApiCreatedResponse({
    description: 'The user was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userData: CreateUserDto): Promise<User> {
    return await this.usersService.create(userData);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | User> {
    return await this.usersService.change(userData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'User was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.deleteOne(id);
  }

  // @Public()
  // @Get('/email/:id')
  // async verifyEmail(@Param('id') id: string, @Res() res: Response) {
  //   await this.usersService.setTrueEmail(id);
  //   return res.redirect('https://getter.uz/auth/login');
  // }

  @Public()
  @Post('/email/verify')
  async verifyEmailCode(@Body() { code, hash }) {
    return await this.usersService.verifyEmailCode(code, hash);
  }

  @Public()
  @Post('/email/code-generate')
  async generateEmailCode(@Body() { email }) {
    return await this.usersService.generateEmailCode(email);
  }
}
