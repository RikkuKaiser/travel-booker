import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateUserRolesDto {
  @ApiProperty({
    description: 'Lista de roles que se asignarán al usuario',
    example: ['ADMIN', 'AGENT'],
    isArray: true,
  })
  @IsArray({ message: 'roles debe ser un arreglo de strings' })
  @ArrayNotEmpty({ message: 'roles no puede estar vacío' })
  @IsString({ each: true, message: 'Cada rol debe ser un string' })
  roles: string[];
}
