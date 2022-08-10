import { Injectable, Logger } from '@nestjs/common';
import { DISCOUNTED_AMOUNT, DISCOUNT_PER_DAYS } from 'src/constants/constants';
import { CreateRentCarOrderDto, GetCarForRentDto } from './cars.dto';
import { CarsRepository } from './cars.repository';

@Injectable()
export class CarsService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly repository: CarsRepository,
  ) { }

  async createCarsTable() {
    await this.repository.createCarsTables()
  }

  async createRentalCarsTable() {
    await this.repository.createRentalCarsTable()
  }

  async calculationPriceRentByPeriod(dateRentStart: Date, dateRentEnd: Date) {
    let sumDays = await this.getSumDays(dateRentStart, dateRentEnd)
    const daysBuckets = DISCOUNT_PER_DAYS
    .reduce((acc, { from, to, discount }) => {
      if (sumDays < from) {
        return acc
      }
      if (sumDays >= to) {
       return [...acc, [to - from, discount]]
      }
      if (sumDays > from) {
       return [...acc, [sumDays - from, discount]];
      }
      return [...acc, [sumDays - from, discount]];
     }, [])
     .reduce((acc, [sumDays, discount]) => {
      return acc + sumDays * ( DISCOUNTED_AMOUNT.BASE * (1 - discount / 100));
     }, 0);
    return daysBuckets;
  }

  async carsIsActive(licensePlate: string) {
    const car = await this.repository.findOneCar(licensePlate)
    if (!car) {
      this.logger.error("Car not found")
      return
    }
    return true
  }

  async  checkWeekDay(dateStart: Date, dateEnd: Date,) {
    const dayOfWeekTo = new Date(dateStart).getDay()
    const dayOfWeekFrom = new Date(dateEnd).getDay()
    if(dayOfWeekTo === 0 || dayOfWeekTo === 6) {
      return false
    } else if (dayOfWeekFrom === 0 || dayOfWeekFrom === 6) {
      return false
    }
      return true
  }

  async getSumDays(dateStart: Date, dateEnd: Date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const getTime = new Date(dateEnd).getTime() - new Date(dateStart).getTime()
    const getDays = Math.round(getTime / oneDay);
    return getDays + 1
  }

  async createSessionRentCar(dto: GetCarForRentDto) {
    const car = await this.repository.findOneCar(dto.licensePlate)
    if(!car) {
      this.logger.error("The car not found")
      return "The car not found"
    }
    const isWeekend = await this.checkWeekDay(dto.rentalStartedAt, dto.rentalEndAt)
    if(!isWeekend) return

    const isActive = await this.carsIsActive(dto.licensePlate)
    if(isActive) {
      const amountDays = await this.getSumDays(car.rental_end_at, dto.rentalStartedAt)
      const days = Math.abs(amountDays)
      if (days > 3) {
       const rentalPrice =  await this.calculationPriceRentByPeriod(dto.rentalStartedAt, dto.rentalEndAt)
       await this.repository.createRentalCarOrder(dto, rentalPrice)
      } else {
        this.logger.log("The car was delivered less than 3 days ago, please choose another")
        return "The car was delivered less than 3 days ago, please choose another"
      }
    }
  }
}