
export interface CarEntity {
  carGuid: string;
  licensePlate: string;
  isActive: Boolean;
  updatedAt: Date;
  createdAt: Date;
}
export interface CreateCarEntity extends Omit<CarEntity, "carGuid"> {}

export interface RentalCarEntity {
  guid: string;
  licensePlate: string,
  rentPrice: number;
  rentalStartedAt: Date;
  rentalEndAt: Date;
  updateAt: Date;
  createdAt: Date;
}

export interface CreateRentalCarOrderEntity extends Omit<RentalCarEntity, "guid" | "rentPrice" | "createdAt" | "updateAt"> { }

export interface UpdateCarEntity extends Omit<CarEntity, 'updatedAt' | 'createdAt'> { }

export interface UpdateRentalCarEntity extends Omit<RentalCarEntity, 'guid' | 'rentalStartedAt' | 'updatedAt' | 'createdAt'> {
  rentalStartedAt?: Date;
}