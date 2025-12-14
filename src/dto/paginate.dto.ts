import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FilterPaginateDto {
  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 10,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;
}
