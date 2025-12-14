import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Nombre completo del cliente que realiza la reserva',
    example: 'Cristóbal Lizárraga',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'cliente@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'ID del destino seleccionado',
    example: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
  })
  @IsUUID()
  @IsNotEmpty()
  destinationId: string;

  @ApiProperty({
    description: 'Fecha programada para el viaje',
    example: '2025-02-15',
  })
  @IsDateString()
  @IsNotEmpty()
  travelDate: string;
}
