import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/modules/bookings/entities/booking.entity';

@Entity('destinations')
export class Destination {
  @ApiProperty({
    description: 'Identificador único del destino',
    example: 'e4a1b1d2-5b7f-4a8b-83b0-9c77f6eac5dd',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del destino',
    example: 'Cancún Todo Incluido',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'País del destino',
    example: 'México',
  })
  @Column({ type: 'varchar', length: 150 })
  country: string;

  @ApiProperty({
    description: 'Ciudad del destino',
    example: 'Quintana Roo',
  })
  @Column({ type: 'varchar', length: 150 })
  city: string;

  @ApiProperty({
    description: 'Indica si el destino está activo',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del destino',
    example: '2025-12-11T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del destino',
    example: '2025-12-11T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Listado de reservas asociadas a este destino',
    type: () => [Booking],
    required: false,
  })
  @OneToMany(() => Booking, (booking) => booking.destination)
  bookings: Booking[];
}
