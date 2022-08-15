import { Injectable, Logger } from '@nestjs/common';
import { BASE_COST, DISCOUNT_PER_DAYS } from 'src/constants/constants';
import { CreateCarDto, CreateCarRentalSessionDto, UpdateCarDto, UpdateCarRentalSessionDto } from './cars.dto';
import { CarsRepository } from './cars.repository';

@Injectable()
export class CarsService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly repository: CarsRepository,
  ) { }

  async createSessionRentalCar(dto: CreateCarRentalSessionDto) {
    const car = await this.repository.findOneCar(dto.licensePlate)
    if (!car) {
      this.logger.error("The car not found")
      return "The car not found"
    }

    const isActive = await this.carsIsActive(dto.licensePlate)
    if (!isActive) return

    const isWeekend = this.checkWeekDay(dto.rentalStartedAt, dto.rentalEndAt)
    if (isWeekend) return

    const sumDays = this.getSumDays(dto.rentalStartedAt, dto.rentalEndAt)

    const сarSessions = await this.repository.findOneSession(dto.licensePlate)
    if (сarSessions.length === 0) {
      if(sumDays > 30) {
        this.logger.warn('The maximum number of rental days has been exceeded. The amount of rental days is more than 30!')
        return
      }
      const rentalPrice = await this.calculationPriceRentByPeriod(dto.rentalStartedAt, dto.rentalEndAt)
      await this.repository.createRentalCarSession(dto, rentalPrice)
      await this.repository.updateCar({licensePlate:dto.licensePlate, isActive: false})
    }

    if(sumDays > 30) {
      this.logger.warn('The maximum number of rental days has been exceeded. The amount of rental days is more than 30!')
      return
    }

    const dateFrom = dto.rentalStartedAt.setDate(dto.rentalStartedAt.getDate() - 3);
    const dateTo = dto.rentalEndAt.setDate(dto.rentalEndAt.getDate() + 3);
    const allCarSessions = await this.repository.findAllSessionsByPeriod(dto.licensePlate, new Date(dateFrom), new Date(dateTo))
    
    if (allCarSessions.length === 0) {
      const rentalPrice = await this.calculationPriceRentByPeriod(dto.rentalStartedAt, dto.rentalEndAt)
      await this.repository.createRentalCarSession(dto, rentalPrice)
      await this.repository.updateCar({licensePlate:dto.licensePlate, isActive: false})
    } else {
      this.logger.warn("The car was delivered less than 3 days ago, please choose another")
      return
    }
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
      return acc + sumDays * ( BASE_COST.BASE * (1 - discount / 100));
     }, 0);
    return daysBuckets;
  }

  async carsIsActive(licensePlate: string) {
    const car = await this.repository.findOneCar(licensePlate)
    if (!car) {
      this.logger.error("Car not found")
      return
    }
    if (car.is_active) {
      this.logger.warn(`Car is active ${false}`)
      return true
    }
    this.logger.warn( 'The car is not available for hire')
    return false
  }

  checkWeekDay(dateStart: Date, dateEnd: Date,) {
    const dayOfWeekTo = new Date(dateStart).getDay()
    const dayOfWeekFrom = new Date(dateEnd).getDay()
    if(dayOfWeekTo === 0 || dayOfWeekTo === 6) {
      this.logger.warn(`This date - ${dateStart} falls on a day off, please choose another`)
      return true
    } else if (dayOfWeekFrom === 0 || dayOfWeekFrom === 6) {
      this.logger.warn(`This date - ${dateEnd} falls on a day off, please choose another`)
      return true
    }
      this.logger.warn(`The day falls on a weekend -  ${false}`)
      return false
  }

  getSumDays(dateStart: Date, dateEnd: Date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const futureDate = new Date(dateStart).getTime()
    const dateInPaste = new Date(dateEnd).getTime()
    let sumDays;
    if(futureDate > dateInPaste) {
      sumDays = futureDate - dateInPaste 
      const getTime = Math.round(sumDays / oneDay);
      return getTime + 1
    }

    if(futureDate < dateInPaste) {
      sumDays = dateInPaste - futureDate
      const getTime = Math.round(sumDays / oneDay);
      return getTime + 1
    }
  }

  async findOneCar(licensePlate: string) {
    const car = await this.repository.findOneCar(licensePlate)
    if(!car) {
      this.logger.warn("The car not found")
    }
    return car
  }

  async deleteCar(licensePlate: string) {
    return await this.repository.deleteCar(licensePlate)
  }

  async deleteCarRentalSession(licensePlate: string) {
    return await this.repository.deleteCarRentalSession(licensePlate)
  }

  async updateCar(dto: UpdateCarDto) {
    return await this.repository.updateCar(dto)
   }

  async updateCarRentalSession(dto: UpdateCarRentalSessionDto) {
   return await this.repository.updateCarRentalSession(dto)
  }

  async createCarsTable() {
    return await this.repository.createCarsTables()
  }

  async createRentalCarsTable() {
    return await this.repository.createRentalCarsTable()
  }

  async createCar(dto: CreateCarDto) {
    return await this.repository.createCar(dto)
  }
}