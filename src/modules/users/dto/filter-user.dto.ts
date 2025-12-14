import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterPaginateDto } from 'src/dto/paginate.dto';

export class FilterUsersDto extends FilterPaginateDto {
  @ApiPropertyOptional({
    description: 'Filtrar por status del usuario',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por rol del usuario',
    example: 'ADMIN',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
