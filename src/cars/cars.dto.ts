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
  rentalPrice?: string;
  @ApiProperty()
  isActive?: string;
  @ApiProperty()
  rentalStartedAt?: Date;
  @ApiProperty()
  rentalEndAt?: Date;
}

export class UpdateCarDto {
  @ApiProperty({
    type: String,
  })
  licensePlate: string;
}