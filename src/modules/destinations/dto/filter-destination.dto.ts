import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { FilterPaginateDto } from 'src/dto/paginate.dto';

export class FilterDestinationDto extends FilterPaginateDto {
  @ApiProperty({ example: 'México' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(150)
  country?: string;

  @ApiProperty({ example: 'Quintana Roo' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(150)
  city?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean = true;
}
