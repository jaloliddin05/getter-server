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
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all orders' })
  @ApiOkResponse({
    description: 'The orders were returned successfully',
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
    return await this.orderService.getAll(
      { limit: query.limit, page: query.page, route },
      where,
    );
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single order by id' })
  @ApiOkResponse({
    description: 'The order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Order> {
    return this.orderService.getById(id);
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new order' })
  @ApiCreatedResponse({
    description: 'The order was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateOrderDto): Promise<InsertResult | Order> {
    return await this.orderService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateOrderDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Order> {
    return await this.orderService.change(data, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting order' })
  @ApiOkResponse({
    description: 'Order was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    return await this.orderService.deleteOne(id);
  }
}
