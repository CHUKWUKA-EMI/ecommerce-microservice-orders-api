import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    const order = await this.ordersService.create(createOrderDto);
    this.client.emit('order_created', order);
    return order;
  }

  @Get()
  async findAll(): Promise<any> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() id: number): Promise<any> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(@Body() updateOrderDto: UpdateOrderDto): Promise<any> {
    await this.ordersService.update(updateOrderDto.id, updateOrderDto);
    const order = await this.ordersService.findOne(updateOrderDto.id);
    this.client.emit('order_updated', order);
    return order;
  }

  @Delete(':id')
  async remove(@Param() id: number): Promise<any> {
    await this.ordersService.remove(id);
    this.client.emit('order_deleted', id);
    return 'Order deleted';
  }
}
