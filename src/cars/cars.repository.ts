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
            license_plate VARCHAR(255) NOT NULL DEFAULT,
            rental_price NUMERIC NOT NULL DEFAULT,
            details JSONB NOT NULL DEFAULT '{}'::JSONB,
            rental_started_at TIMESTAMP NOT NULL,
            rental_end_at TIMESTAMP NOT NULL,
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
        '${new Date().toUTCString()}')`,
      (err) => {
        if (err) this.logger.error(err)
      })
  }

  async createRentalCarSession(dto: CreateCarRentalSessionEntity, rentalPrice: number) {
    const uuid = uuidv4()
    await this.db.query(
      `INSERT INTO rental_car
      (
        guid, 
        license_plate,
        rental_price,
        details,
        rental_started_at,
        rental_end_at, 
        updated_at, 
        created_at)
      VALUES
      (
        '${uuid}',
        '${dto.licensePlate}',
        '${rentalPrice}',
        '${JSON.stringify(dto.details)}',
        '${dto.rentalStartedAt}', 
        '${dto.rentalEndAt}',  
        '${new Date().toUTCString()}',
        '${new Date().toUTCString()}')`,
      (error, response) => {
        if (error) this.logger.error(error)
        this.logger.debug(JSON.stringify(response.rows[0]))
      })
  }

  async findOneCar(licensePlate: string) {
    const response = await this.db.query(`SELECT * FROM cars WHERE license_plate = '${licensePlate}'`)
    this.logger.debug(JSON.stringify(response.rows[0]))
    return response.rows[0]
  }

  async findOneSession(licensePlate: string) {
    const response = await this.db.query(`SELECT * FROM rental_car WHERE license_plate = '${licensePlate}'`)
    return response.rows
  }

  async findAllSessionsByPeriod(licensePlate: string, dateStart: Date, dateEnd: Date) {
    const response = await this.db.query(
      `SELECT * 
      FROM rental_car 
      WHERE (license_plate = '${licensePlate}' AND rental_started_at >='${dateStart.toISOString()}' AND rental_end_at < '${dateEnd.toISOString()}')`)
    return response.rows
  }

  async findAllSessionsasdf(licensePlate: string, dateStart: Date, dateEnd: Date) {
    const response = await this.db.query(
      `SELECT * 
      FROM rental_car 
      WHERE (license_plate = '${licensePlate}' AND rental_end_at + INTERVAL '3 DAY' <= '${dateStart.toISOString()} AND rental_started_at - INTER)`)
    return response.rows
  }

  async updateCar(dto: UpdateCarEntity) {
    await this.db.query(
      `UPDATE cars
           SET (is_active, updated_at) = ('${dto.isActive}', '${new Date().toISOString()}')
           WHERE license_plate = '${dto.licensePlate}'
           RETURNING is_active, updated_at`,
      (error, response) => {
        if (error) this.logger.error(error)
        this.logger.debug(dto.licensePlate, JSON.stringify(response.rows[0]))
      })
  }

  async updateCarRentalSession(dto: UpdateRentalCarEntity) {
    await this.db.query(
      `UPDATE rental_car,
         SET (license_plate, details, rental_started_at, rental_end_at) = (
           '${dto.licensePlate}', 
           '${dto.details}', 
           '${dto.rentalStartedAt}', 
           '${dto.rentalEndAt}')
         WHERE license_plate = ${dto.licensePlate}
         RETURNING license_plate, rental_price, details, rental_started_at, rental_end_at`,
      (err) => { this.logger.error(err) })
  }

  async deleteCar(licensePlate: string) {
    await this.db.query(`
    DELETE FROM cars
      WHERE license_plate = ${licensePlate}`,
      (err) => { this.logger.error(err) })
  }

  async deleteCarRentalSession(licensePlate: string) {
    await this.db.query(`
    DELETE FROM cars
      WHERE license_plate = ${licensePlate}`,
      (err) => { this.logger.error(err) })
  }
}