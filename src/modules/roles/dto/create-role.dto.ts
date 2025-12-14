import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toUpperCase() : '',
  )
  name: string;

  @ApiProperty({
    description: 'Descripción opcional del rol',
    example: 'Administrador con acceso total',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  description?: string;
}
