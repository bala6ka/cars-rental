import { Inject, Injectable, Logger } from "@nestjs/common";
import { DB_CONFIG, DB_CONNECTION } from "src/constants/constants";
import { v4 as uuidv4 } from 'uuid';
import { CreateCarEntity, CreateRentalCarOrderEntity, UpdateCarEntity } from "./cars.entity";

@Injectable()
export class CarsRepository {
  private logger = new Logger(this.constructor.name);
  constructor(@Inject(DB_CONNECTION) private db: any) { }

  async createCarsTables() {
    await this.db.query(
      `CREATE TABLE cars
          (
            car_guid uuid, 
            license_plate VARCHAR(255),
            is_active BOOLEAN NOT NULL,
            updated_at TIMESTAMP,
            created_at TIMESTAMP,
            PRIMARY KEY ("car_guid")
          )`,
      (err) => { this.logger.error(err) })
  }

  async createRentalCarsTable() {
    await this.db.query(
      `CREATE TABLE rental_cars 
          (
            guid uuid,
            car_guid uuid,
            rent_price NUMERIC,
            rental_started_at TIMESTAMP,
            rental_end_at TIMESTAMP,
            created_at TIMESTAMP,
            PRIMARY KEY ("guid")
          )`,
      (err) => { this.logger.error(err) })
  }

  async createCar(dto: CreateCarEntity) {
    const uuid = uuidv4()
    await this.db.query(
      `INSERT INTO cars
      (car_guid, license_plate,  is_active, updated_at, created_at)
      VALUES
      (
        '${uuid}', 
        '${dto.licensePlate}', 
        '${dto.isActive}', 
        '${new Date(dto.updatedAt).toUTCString()}', 
        '${new Date(dto.createdAt).toUTCString()}')`
    )
  }

  async createRentalCarOrder(dto: CreateRentalCarOrderEntity) {
    const uuid = uuidv4()
    const car = await this.findOneByGuid(dto.carGuid)
    if(!car) {
      this.logger.error(`Failed to create a booking for this car number, the car is not in the database`)
    }

    await this.db.query(
      `INSERT INTO rental_cars
      (guid, car_guid, rent_price, rental_started_at, rental_end_at, created_at)
      VALUES
      ('${uuid}', '${uuid}', '${dto.rentPrice}', '${new Date(dto.rentalStartedAt).toUTCString()}', '${dto.rentPrice}', '${new Date(dto.updatedAt).toUTCString()}', '${new Date(dto.createdAt).toUTCString()}')`
    )
  }

  async findOneByGuid(carGuid: string) {
    const response = this.db.query(`SELECT * FROM cars WHERE car_guid = '${carGuid}'`)
    return response.rows[0]
  }

  async findOneByLicensePlate(licensePlate: string) {
    const response = this.db.query(`SELECT * FROM cars WHERE license_plate = '${licensePlate}'`)
    return response.rows[0]
  }

  async update(dto: UpdateCarEntity[]) {
    Promise.all(dto.map((item) => {
      this.db.query(
        `UPDATE rental_cars,
           SET is_active = ${item.isActive}, ,
           WHERE car_id = ${item.carGuid}`,
        (err) => { this.logger.error(err) })
    }))
  }
}