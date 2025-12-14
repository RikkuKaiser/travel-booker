import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { UserRole } from './modules/users/entities/user-role.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { Destination } from './modules/destinations/entities/destination.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'travel_booker',
  synchronize: false,
  logging: true,
  entities: [User, Role, UserRole, Booking, Destination],
  migrations: ['src/migrations/*.ts'],
});
