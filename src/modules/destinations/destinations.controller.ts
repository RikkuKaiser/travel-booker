import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Roles } from 'src/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilterDestinationDto } from './dto/filter-destination.dto';

@ApiTags('destinations')
@ApiBearerAuth()
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Roles('ADMIN', 'AGENT')
  @Post()
  @ApiOperation({ summary: 'Crear un destino turístico' })
  @ApiBody({
    description: 'Datos necesarios para crear un destino',
    type: CreateDestinationDto,
    examples: {
      CreateExample: {
        summary: 'Ejemplo de creación de destino',
        value: {
          name: 'Cancún Todo Incluido',
          country: 'México',
          city: 'Quintana Roo',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Destino creado correctamente',
    schema: {
      example: {
        id: 'e4a1b1d2-5b7f-4a8b-83b0-9c77f6eac5dd',
        name: 'Cancún Todo Incluido',
        country: 'México',
        city: 'Quintana Roo',
        isActive: true,
        createdAt: '2025-12-11T00:00:00.000Z',
        updatedAt: '2025-12-11T00:00:00.000Z',
      },
    },
  })
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Roles('ADMIN', 'AGENT', 'VIEWER')
  @Get()
  @ApiOperation({ summary: 'Listar todos los destinos turísticos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de destinos con paginación',
    schema: {
      example: {
        data: [
          {
            id: 'e928b26b-2669-4d15-a6ec-75a8da5f29d8',
            name: 'Cancún Todo Incluido',
            country: 'México',
            city: 'Quintana Roo',
          },
          {
            id: 'a3c4d5e6-7f89-4b12-91cd-123456789abc',
            name: 'Tokio City Tour',
            country: 'Japón',
            city: 'Tokio',
          },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  findAll(@Query() query: FilterDestinationDto) {
    return this.destinationsService.findAll(query);
  }

  @Roles('ADMIN', 'AGENT', 'VIEWER')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un destino por ID' })
  @ApiResponse({
    status: 200,
    description: 'Destino encontrado',
    schema: {
      example: {
        id: 'e4a1b1d2-5b7f-4a8b-83b0-9c77f6eac5dd',
        name: 'Cancún Centro',
        country: 'México',
        city: 'Quintana Roo',
        isActive: true,
        createdAt: '2025-12-11T00:00:00.000Z',
        updatedAt: '2025-12-12T00:00:00.000Z',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  @Roles('ADMIN', 'AGENT')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un destino turístico' })
  @ApiBody({
    description: 'Datos que se pueden actualizar del destino',
    type: UpdateDestinationDto,
    examples: {
      UpdateExample: {
        summary: 'Ejemplo de actualización de destino',
        value: {
          name: 'Cancún Centro',
          country: 'México',
          city: 'Quintana Roo',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Destino actualizado correctamente',
    schema: {
      example: {
        id: 'e4a1b1d2-5b7f-4a8b-83b0-9c77f6eac5dd',
        name: 'Cancún Centro',
        country: 'México',
        city: 'Quintana Roo',
        isActive: true,
        createdAt: '2025-12-11T00:00:00.000Z',
        updatedAt: '2025-12-12T00:00:00.000Z',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un destino' })
  @ApiResponse({
    status: 200,
    description: 'Destino eliminado correctamente',
    schema: {
      example: {
        message: 'Destination deleted successfully',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }
}
