import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    CarsModule,
    DbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
