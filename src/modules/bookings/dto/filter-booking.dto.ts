import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../enums/booking-status.enum';

export class FilterBookingDto {
  @ApiPropertyOptional({ example: 1, description: 'Página actual' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Registros por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    description: 'Estado de la reserva',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({
    example: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
    description: 'Filtrar por destino',
  })
  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Fecha inicial del viaje (obligatoria)',
  })
  @IsDateString()
  fromDate: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Fecha final del viaje (obligatoria)',
  })
  @IsDateString()
  toDate: string;
}
