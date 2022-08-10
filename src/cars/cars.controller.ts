import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCarsDto, CreateRentCarOrderDto } from './cars.dto';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';


@ApiTags('Cars rent')
@Controller('cars')
export class CarsController {
  constructor(
    private readonly cars: CarsService,
    private readonly repository: CarsRepository
    ) {}

  @Get()
  findAll() {
    
  }

  @ApiOperation({ summary: '' })
  @Post()
  getDtoCars(@Body() dto: CreateCarsDto) {
  }

  @ApiOperation({ summary: '' })
  @Post("create")
  async createOrder(@Body() dto: CreateRentCarOrderDto) {
    await this.cars.createSessionRentCar(dto)
  }
}