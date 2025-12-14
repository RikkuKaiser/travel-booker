import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Cancún Todo Incluido' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'México' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  country: string;

  @ApiProperty({ example: 'Quintana Roo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  city: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
