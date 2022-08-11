import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCarDto, CreateCarRentalSessionDto } from './cars.dto';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';


@ApiTags('Cars rental')
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carService: CarsService,
    private readonly repository: CarsRepository
    ) {}
  
  @ApiOperation({ summary: 'Test' })
  @Get()
  findAll() {
    this.carService.getSumDays(new Date('2022-01-01'), new Date('2022-01-05'))
  }
  
  @ApiOperation({ summary: 'Get one car by license plate.' })
  @Get(':license_plate')
  findOne(@Param('license_plate') licensePlate: string) {
    return this.carService.findOneCar(licensePlate)
  }

  @ApiOperation({ summary: 'For add new car' })
  @Post('create/car')
  createCar(@Body() dto: CreateCarDto) {
    return this.carService.createCar(dto)
  }

  @ApiOperation({ summary: 'For add new car rental session' })
  @Post("create/session")
  createOrder(@Body() dto: CreateCarRentalSessionDto) {
    return this.carService.createSessionRentalCar(dto)
  }

  // @ApiOperation({ summary: '' })
  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: Update) {
  //   return 
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 
  }

  // @ApiOperation({ summary: '' })
  // @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.'})
  // @Post()
  // getDtoCars(@Body() dto: CreateCarDto) {
  //   return this.repository.createCar()
  // }


}