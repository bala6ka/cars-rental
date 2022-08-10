import { Injectable, Logger } from '@nestjs/common';
import { DISCONT } from 'src/constants/constants';
import { GetCarForRentDto } from './cars.dto';
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

  async carsIsActive(carGuid: string) {
    const car = await this.repository.findOneByGuid(carGuid)
    if (!car) {
      this.logger.error("Car not found")
    }
    return car
  }

  async isRentAvailable(carGuid: string) {
    const car = await this.repository.findOneByGuid(carGuid);
    if (!car) {
      this.logger.error("Car not found")
    }
    const date = new Date(car).getDate()
    const dateNow = new Date().getDate()
    const sumDaysSinceLastRental = date + dateNow
    if (sumDaysSinceLastRental >= 3) {
      return true
    }
    this.logger.error("The car was delivered less than 3 days ago, please choose another")
  }

  calculationCostRentByPeriod(rentPeriod: { dateStart: string, dateEnd: string }) {
    let dateStart = new Date(rentPeriod.dateStart).getDate()
    let dateEnd = new Date(rentPeriod.dateEnd).getDate()
    let totalDays = dateStart + dateEnd
    let cost = 1000

    if (totalDays <= 4) {
      return cost;
    }

    if (totalDays >= 5 && totalDays <= 9) {
      return cost = (cost / 100 * DISCONT.MEDIUM)
    }

    if (totalDays >= 10 && totalDays <= 17) {
      return cost = (cost / 100 * DISCONT.GOLD)
    }

    if (totalDays >= 18 && totalDays <= 29) {
      return cost = (cost / 100 * DISCONT.PLATINUM)
    }
  }

  async getCarForRent(dto: GetCarForRentDto) {
   const car = await this.repository.findOneByLicensePlate(dto.licensePlate)
   if(!car) {
     this.logger.error("Car not found")
   }
   const checkCarAvailability = await this.isRentAvailable(car.car_guid)

   if(checkCarAvailability) {
     const rentPeriod ={
       dateStart: dto.rentalStartedAt,
       dateEnd: dto.rentalEndAt
     }
     const price = await this.calculationCostRentByPeriod({rentPeriod})
   }
  }
}