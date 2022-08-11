import { Inject, Injectable, Logger } from "@nestjs/common";
import { DB_CONFIG, DB_CONNECTION } from "src/constants/constants";
import { v4 as uuidv4 } from 'uuid';
import { CreateCarEntity, CreateCarRentalSessionEntity, UpdateCarEntity, UpdateRentalCarEntity } from "./cars.entity";

@Injectable()
export class CarsRepository {
  private logger = new Logger(this.constructor.name);
  constructor(@Inject(DB_CONNECTION) private db: any) { }

  async createCarsTables() {
    await this.db.query(
      `CREATE TABLE cars
          (
            car_guid uuid, 
            license_plate VARCHAR(255) NOT NULL UNIQUE,
            is_active BOOLEAN NOT NULL,
            updated_at TIMESTAMP,
            created_at TIMESTAMP,
            PRIMARY KEY ("car_guid")
          )`,
      (err) => { this.logger.error(err) })
  }

  async createRentalCarsTable() {
    await this.db.query(
      `CREATE TABLE rental_car 
          (
            guid uuid,
            license_plate VARCHAR(255),
            rental_cost NUMERIC,
            details JSONB NOT NULL DEFAULT '{}'::JSONB,
            rental_started_at TIMESTAMP,
            rental_end_at TIMESTAMP,
            updated_at TIMESTAMP,
            created_at TIMESTAMP,
            PRIMARY KEY ("guid")
          )`,
      (err) => { this.logger.error(err) })
  }

  async createCar(dto: CreateCarEntity) {
    const uuid = uuidv4()
    await this.db.query(
      `INSERT INTO cars
      (
        car_guid,
        license_plate,
        is_active,
        updated_at,
        created_at
      )
      VALUES
      (
        '${uuid}', 
        '${dto.licensePlate}', 
        '${dto.isActive}',
        '${new Date().toUTCString()}',
        '${new Date().toUTCString()}')`
    , (err) => {
      if (err) this.logger.log(err)
    })
  }

  async createRentalCarOrder(dto: CreateCarRentalSessionEntity, rentalPrice: number) {
    const uuid = uuidv4()
    await this.db.query(
      `INSERT INTO rental_car
      (
        guid, 
        license_plate, 
        rental_cost, 
        rental_started_at,
        rental_end_at, 
        updated_at, 
        created_at
      )
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

  async findOneCarRentSession(licensePlate: string) {
    const response = await this.db.query(`SELECT * FROM rental_car WHERE license_plate = '${licensePlate}'`)
    return response.rows[0]
  }

  async updateCar(dto: UpdateCarEntity[]) {
    Promise.all(dto.map((item) => {
      this.db.query(
        `UPDATE cars,
           SET is_active = ${item.isActive}, ,
           WHERE car_id = ${item.licensePlate}`,
        (err) => { this.logger.error(err) })
    }))
  }

  // async updateCarRentalSession(dto: UpdateRentalCarEntity[]) {
  //   Promise.all(dto.map((item) => {
  //     this.db.query(
  //       `UPDATE rental_car,
  //          SET is_active = ${item.isActive}, ,
  //          WHERE car_id = ${item.licensePlate}`,
  //       (err) => { this.logger.error(err) })
  //   }))
  // }
}