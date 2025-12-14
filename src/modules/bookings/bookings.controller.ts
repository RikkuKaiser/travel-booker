import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles('ADMIN', 'AGENT')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una reserva turística' })
  @ApiBody({
    description: 'Datos necesarios para crear una reserva',
    type: CreateBookingDto,
    examples: {
      CreateExample: {
        summary: 'Ejemplo de creación',
        value: {
          customerName: 'Cristóbal Lizárraga',
          customerEmail: 'cliente@mail.com',
          destinationId: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
          travelDate: '2025-02-15',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada correctamente',
    schema: {
      example: {
        id: 1,
        customerName: 'Cristóbal Lizárraga',
        customerEmail: 'cliente@mail.com',
        destinationId: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
        travelDate: '2025-02-15',
        status: 'PENDING',
        createdByUserId: 'bfb342a0-cc3c-4167-9316-243cbb1df44d',
        createdAt: '2025-12-11T00:00:00.000Z',
        updatedAt: '2025-12-11T00:00:00.000Z',
        destination: {
          id: '...',
          name: 'Cancún Todo Incluido',
          country: 'México',
          city: 'Quintana Roo',
        },
      },
    },
  })
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(dto, req.user.userId);
  }

  @Roles('ADMIN', 'AGENT', 'VIEWER')
  @Get()
  @ApiOperation({
    summary: 'Obtener reservas',
    description:
      'Obtiene un listado paginado de reservas con filtros opcionales por estado, destino y rango de fechas.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Cantidad de registros por página',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BookingStatus,
    description: 'Filtrar por estado de la reserva',
  })
  @ApiQuery({
    name: 'destinationId',
    required: false,
    example: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
    description: 'Filtrar por destino',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    example: '2025-01-01',
    description: 'Fecha inicial del viaje (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    example: '2025-12-31',
    description: 'Fecha final del viaje (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de reservas paginadas',
    schema: {
      example: {
        data: [
          {
            id: 1,
            customerName: 'Juan Pérez',
            customerEmail: 'jp@mail.com',
            destinationId: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
            travelDate: '2025-03-12',
            status: 'PENDING',
            destination: {
              id: 'a02c1a45-b912-4bbd-9381-5c8f9de62aa4',
              name: 'Cancún Todo Incluido',
              country: 'México',
              city: 'Cancún',
              isActive: true,
            },
            createdAt: '2025-01-01T10:00:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  findAll(@Query() query: FilterBookingDto) {
    return this.bookingsService.findAll(query);
  }

  @Roles('ADMIN', 'AGENT', 'VIEWER')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
    schema: {
      example: {
        id: 1,
        customerName: 'Juan Pérez',
        customerEmail: 'cliente@mail.com',
        travelDate: '2025-02-10',
        status: 'CONFIRMED',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Roles('ADMIN', 'AGENT')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva' })
  @ApiBody({
    description: 'Datos a actualizar (generalmente el status)',
    type: UpdateBookingDto,
    examples: {
      UpdateExample: {
        summary: 'Cambio a CONFIRMED',
        value: {
          status: 'CONFIRMED',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada correctamente',
  })
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(+id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva eliminada',
    schema: {
      example: {
        message: 'Reserva eliminada correctamente',
        id: 1,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
