import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '../destinations/entities/destination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Destination])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
