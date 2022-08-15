import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCarDto, CreateCarRentalSessionDto, UpdateCarDto, UpdateCarRentalSessionDto } from './cars.dto';
import { CarsService } from './cars.service';


@ApiTags('Cars rental')
@Controller('')
export class CarsController {
  constructor(
    private readonly carService: CarsService,
    ) {}
  
  @ApiOperation({ summary: 'Create tables for app' })
  @Get('/create')
  async createTables() {
    await this.carService.createCarsTable()
    await this.carService.createRentalCarsTable()
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

  @ApiOperation({ summary: 'For update car' })
  @Put('/update/car')
  async updateCar(@Body() dto: UpdateCarDto) {
    return await this.carService.updateCar(dto)
  }

  @ApiOperation({ summary: 'For update session' })
  @Put('/update/session')
  async updateSession( @Body() dto: UpdateCarRentalSessionDto) {
    return await this.carService.updateCarRentalSession(dto)
  }

  @ApiOperation({ summary: 'For delete car' })
  @Delete('cars/:license_plate')
  removeCar(@Param('license_plate') license_plate: string) {
    return  this.carService.deleteCar(license_plate)
  }

  @ApiOperation({ summary: 'For delete session' })
  @Delete('cars/session/:license_plate')
  removeSession(@Param('license_plate') license_plate: string) {
    return  this.carService.deleteCarRentalSession(license_plate)
  }
}