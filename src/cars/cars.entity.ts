
export interface CarEntity {
  carGuid: string;
  licensePlate: string;
  isActive: Boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface RentalCarEntity {
  guid: string;
  licensePlate: string,
  rentCost: number;
  details: RentalCarDetails,
  rentalStartedAt: Date;
  rentalEndAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateCarEntity extends Omit<CarEntity, 'carGuid' | 'updatedAt' | 'createdAt'> {}

export interface CreateCarRentalSessionEntity extends Omit<RentalCarEntity, 'guid' | 'rentCost' | 'createdAt' | 'updatedAt'> { }

export interface UpdateCarEntity {
  licensePlate: string;
  isActive: Boolean;
}
export interface UpdateRentalCarEntity {
  licensePlate: string,
  details?: RentalCarDetails,
  rentalStartedAt?: Date;
  rentalEndAt?: Date;
}

export interface RentalCarDetails {
  sessionNumber: string
}