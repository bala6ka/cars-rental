import { ApiProperty } from '@nestjs/swagger';
import { RentalCarDetails } from './cars.entity';

export class CreateCarDto {
  @ApiProperty()
  licensePlate: string;
  @ApiProperty()
  isActive: Boolean;
}

export class CreateCarRentalSessionDto {
  @ApiProperty()
  licensePlate: string;
  @ApiProperty()
  details: RentalCarDetails;
  @ApiProperty()
  rentalStartedAt: Date;
  @ApiProperty()
  rentalEndAt: Date;
}

export class UpdateCarRentalSessionDto {
  @ApiProperty()
  licensePlate: string;
  @ApiProperty()
  details: RentalCarDetails;
  @ApiProperty()
  rentalStartedAt?: Date;
  @ApiProperty()
  rentalEndAt?: Date;
}

export class UpdateCarDto {
  @ApiProperty()
  licensePlate: string;
  @ApiProperty()
  isActive: Boolean;
}