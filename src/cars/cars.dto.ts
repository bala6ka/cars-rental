import { ApiProperty } from '@nestjs/swagger';

export class CreateCarsDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  cars_color: string;
}

export class GetCarForRentDto {
  @ApiProperty()
  licensePlate: string;
  @ApiProperty()
  rentalStartedAt: Date;
  @ApiProperty()
  rentalEndAt: Date;
}