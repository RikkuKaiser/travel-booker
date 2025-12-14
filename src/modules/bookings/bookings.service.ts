import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Destination } from 'src/modules/destinations/entities/destination.entity';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(dto: CreateBookingDto, createdByUserId: string) {
    const destination = await this.destinationRepository.findOne({
      where: {
        id: dto.destinationId,
        isActive: true,
      },
    });

    if (!destination) {
      throw new NotFoundException('El destino no existe o no está activo');
    }

    const booking = this.bookingRepository.create({
      ...dto,
      createdByUserId,
      destination,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(query: FilterBookingDto) {
    const {
      page = 1,
      limit = 10,
      status,
      destinationId,
      fromDate,
      toDate,
    } = query;

    if (new Date(fromDate) > new Date(toDate)) {
      throw new BadRequestException('fromDate no puede ser mayor que toDate');
    }

    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.destination', 'destination')
      .where('destination.isActive = :isActive', { isActive: true });

    if (status) {
      qb.andWhere('booking.status = :status', { status });
    }

    if (destinationId) {
      qb.andWhere('booking.destinationId = :destinationId', {
        destinationId,
      });
    }

    if (fromDate && toDate) {
      qb.andWhere('booking.travelDate BETWEEN :from AND :to', {
        from: fromDate,
        to: toDate,
      });
    } else if (fromDate) {
      qb.andWhere('booking.travelDate >= :from', { from: fromDate });
    } else if (toDate) {
      qb.andWhere('booking.travelDate <= :to', { to: toDate });
    }

    qb.orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return booking;
  }

  async update(id: number, dto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    if (!dto.status) {
      throw new BadRequestException(
        'Solo se permite actualizar el estado de la reserva',
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden modificar reservas en estado PENDING',
      );
    }

    if (dto.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'La reserva solo puede cambiar de PENDING a CONFIRMED',
      );
    }

    booking.status = BookingStatus.CONFIRMED;

    return this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden cancelar reservas en estado PENDING',
      );
    }

    booking.status = BookingStatus.CANCELLED;

    await this.bookingRepository.save(booking);

    return {
      message: 'Reserva cancelada correctamente',
      id,
    };
  }
}
