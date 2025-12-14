import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único del usuario (UUID)',
    example: 'd54e888d-f15c-42a2-8718-201c1223cbc6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario (único)',
    example: 'juan.perez@mail.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hash de la contraseña del usuario.',
    example: '$2b$10$somerandomhashvalue123456789',
  })
  @Column()
  passwordHash: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 'ACTIVE',
  })
  @Column({ default: 'ACTIVE' })
  status: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-12-11T00:36:11.349Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2025-12-11T01:15:24.102Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Roles asignados al usuario',
    example: ['ADMIN', 'AGENT'],
    type: [String],
  })
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
