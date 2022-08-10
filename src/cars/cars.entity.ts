
export interface CarEntity {
  carGuid: string;
  licensePlate: string;
  isActive: Boolean;
  updatedAt: Date;
  createdAt: Date;
}
export interface CreateCarEntity extends Omit<CarEntity, "carGuid"> {}

export interface RentalCarEntity extends Omit<CarEntity, 'carGuid' | 'isActive' | 'licensePlate'> {
  guid: string;
  rentPrice: number;
  rentalStartedAt: Date;
  rentalEndAt: Date;
}

export interface CreateRentalCarOrderEntity extends Omit<RentalCarEntity, "guid"> {
  carGuid: string;
}


export interface UpdateCarEntity extends Omit<CarEntity, 'updatedAt' | 'createdAt'> { }

export interface UpdateRentalCarEntity extends Omit<RentalCarEntity, 'guid' | 'rentalStartedAt' | 'updatedAt' | 'createdAt'> {
  rentalStartedAt?: Date;
}