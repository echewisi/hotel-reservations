// hotel-reservations/src/hotel/hotel.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { HotelEntity } from './hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HotelEntity])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
