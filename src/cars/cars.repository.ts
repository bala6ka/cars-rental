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
            license_plate VARCHAR(255),
            rent_price NUMERIC,
            rental_started_at TIMESTAMP,
            rental_end_at TIMESTAMP,
            update_at TIMESTAMP,
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

  async createRentalCarOrder(dto: CreateRentalCarOrderEntity, rentalPrice: number) {
    const uuid = uuidv4()
    await this.db.query(
      `INSERT INTO rental_cars
      (guid, license_plate, rent_price, rental_started_at, rental_end_at, update_at, created_at)
      VALUES
      (
        '${uuid}',
        '${dto.licensePlate}',
        '${rentalPrice}', 
        '${new Date(dto.rentalStartedAt).toUTCString()}', 
        '${new Date(dto.rentalEndAt).toUTCString()}',  
        '${new Date().toUTCString()}'),
        '${new Date().toUTCString()}')`
    )
  }

  async findOneCar(licensePlate: string) {
    const response = await this.db.query(`SELECT * FROM cars WHERE license_plate = '${licensePlate}'`)
    return response.rows[0]
  }

  async findOneRecordRent(licensePlate: string) {
    const response = await this.db.query(`SELECT * FROM rental_cars WHERE license_plate = '${licensePlate}'`)
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