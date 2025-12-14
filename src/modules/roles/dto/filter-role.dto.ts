import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { FilterPaginateDto } from 'src/dto/paginate.dto';

export class FilterRoleDto extends FilterPaginateDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toUpperCase() : '',
  )
  @IsOptional()
  name?: string;
}
