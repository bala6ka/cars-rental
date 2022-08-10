import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCarsDto } from './cars.dto';
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
  async func() {
    const test = await this.repository.findOne("fe3d000c-b574-4b3d-9f5e-9c5c4be2aa38")
    console.log(test)
  }
  @ApiOperation({ summary: '' })
  @Post()
  getDtoCars(@Body() dto: CreateCarsDto) {
    return this.cars.PostReq()
  }
}