import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    minLength: 2,
    maxLength: 100,
    example: 'Juan Pérez',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(2, 100)
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    minLength: 6,
    example: 'MiContraseña123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  password: string;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: UserStatus,
    required: false,
    default: UserStatus.ACTIVE,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus = UserStatus.ACTIVE;

  @ApiProperty({
    description: 'Roles asignados al usuario',
    example: ['ADMIN', 'AGENT', 'VIEWER'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  roles?: string[];
}
