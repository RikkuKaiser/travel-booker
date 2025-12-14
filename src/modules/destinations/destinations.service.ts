import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(createDestinationDto: CreateDestinationDto) {
    const newDestination =
      this.destinationRepository.create(createDestinationDto);
    const saved = await this.destinationRepository.save(newDestination);

    return saved;
  }

  async findAll(query: FilterDestinationDto) {
    const { country, city, isActive, page = 1, limit = 10 } = query;

    const qb = this.destinationRepository
      .createQueryBuilder('destination')
      .select([
        'destination.id',
        'destination.name',
        'destination.country',
        'destination.city',
      ]);

    if (country) {
      qb.andWhere('destination.country ILIKE :country', {
        country: `%${country}%`,
      });
    }

    if (city) {
      qb.andWhere('destination.city ILIKE :city', { city: `%${city}%` });
    }

    if (isActive !== undefined) {
      qb.andWhere('destination.isActive = :isActive', { isActive });
    }

    qb.skip((page - 1) * limit).take(limit);

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

  async findOne(id: string) {
    const destination = await this.destinationRepository.findOne({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    return destination;
  }

  async update(id: string, updateDestinationDto: UpdateDestinationDto) {
    const destination = await this.destinationRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    if (
      updateDestinationDto.isActive === false &&
      destination.isActive === true
    ) {
      const activeBookingsCount = await this.destinationRepository
        .createQueryBuilder('destination')
        .leftJoin('destination.bookings', 'booking')
        .where('destination.id = :id', { id })
        .andWhere('booking.status != :status', {
          status: BookingStatus.CANCELLED,
        })
        .getCount();

      if (activeBookingsCount > 0) {
        throw new BadRequestException(
          'No se puede desactivar el destino porque tiene reservas activas asociadas',
        );
      }
    }

    Object.assign(destination, updateDestinationDto);

    const updated = await this.destinationRepository.save(destination);

    return {
      data: updated,
      meta: {},
    };
  }

  async remove(id: string) {
    const destination = await this.destinationRepository.findOne({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    const activeBookingsCount = await this.destinationRepository
      .createQueryBuilder('destination')
      .leftJoin('destination.bookings', 'booking')
      .where('destination.id = :id', { id })
      .andWhere('booking.status != :status', {
        status: BookingStatus.CANCELLED,
      })
      .getCount();

    if (activeBookingsCount > 0) {
      throw new BadRequestException(
        'No se puede desactivar el destino porque tiene reservas activas asociadas',
      );
    }

    destination.isActive = false;
    await this.destinationRepository.save(destination);

    return {
      message: 'Destination deleted successfully',
    };
  }
}
