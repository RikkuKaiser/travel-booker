import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../enums/booking-status.enum';
import { Destination } from 'src/modules/destinations/entities/destination.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('bookings')
export class Booking {
  @ApiProperty({
    description: 'Identificador único de la reserva',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre completo del cliente que realiza la reserva',
    example: 'Cristóbal Lizárraga',
  })
  @Column({ length: 150 })
  customerName: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'cliente@mail.com',
  })
  @Column()
  customerEmail: string;

  @ApiProperty({
    description:
      'ID del destino seleccionado por el cliente. Debe existir en la tabla "destinations".',
    example: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
  })
  @Column()
  destinationId: string;

  @ApiProperty({
    description: 'Estado actual de la reserva',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Fecha programada para el viaje',
    example: '2025-02-15',
  })
  @Column({ type: 'date' })
  travelDate: Date;

  @ApiProperty({
    description:
      'ID del usuario que creó la reserva. Puede ser null si el registro fue generado automáticamente.',
    example: 'bfb342a0-cc3c-4167-9316-243cbb1df44d',
    nullable: true,
  })
  @Column({ nullable: true })
  createdByUserId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-01-01T17:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-02T12:10:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Destino al que pertenece esta reserva',
    type: () => Destination,
  })
  @ManyToOne(() => Destination, (destination) => destination.bookings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  destination: Destination;

  @ApiProperty({
    description: 'Usuario que creó esta reserva',
    type: () => User,
    nullable: true,
  })
  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'SET NULL',
  })
  createdBy: User;
}
