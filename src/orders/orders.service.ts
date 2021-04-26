import { Order, OrderDocument } from './schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.OrderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.OrderModel.find().exec();
  }

  async findOne(id: number): Promise<Order> {
    return this.OrderModel.findOne({ id });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<any> {
    return this.OrderModel.findOneAndUpdate({ id }, updateOrderDto);
  }

  async remove(id: number): Promise<any> {
    return this.OrderModel.findOneAndDelete({ id });
  }
}
