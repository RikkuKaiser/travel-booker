import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('health')
@ApiBearerAuth()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Roles('ADMIN')
  @Get()
  @ApiOperation({
    summary: 'Verifica el estado del servicio y la conexión a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio activo y DB conectada',
    schema: {
      example: {
        status: 'ok',
        database: 'connected',
        timestamp: '2025-12-13T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al conectarse a la base de datos',
    schema: {
      example: {
        status: 'error',
        database: 'disconnected',
        timestamp: '2025-12-13T10:30:00.000Z',
        message: 'No se pudo conectar a la base de datos',
      },
    },
  })
  check() {
    return this.healthService.checkDB();
  }
}
