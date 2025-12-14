import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/users/entities/user-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @ApiProperty({
    description: 'Identificador numérico del rol',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre único del rol (ej. ADMIN, AGENT, VIEWER)',
    example: 'ADMIN',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Descripción breve del rol',
    example: 'Administrator role with full system access',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Relación con la tabla pivote user_roles',
    type: 'array',
    items: { type: 'object' },
  })
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
