import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';

@Module({
  imports: [DbModule],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository,],
})
export class CarsModule {}
