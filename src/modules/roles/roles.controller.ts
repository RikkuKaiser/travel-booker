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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FilterRoleDto } from './dto/filter-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiBody({
    description: 'Datos para crear un rol',
    type: CreateRoleDto,
    schema: {
      example: {
        name: 'AGENT',
        description: 'Puede gestionar reservas y destinos',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado correctamente',
    schema: {
      example: {
        id: 1,
        name: 'AGENT',
        description: 'Puede gestionar reservas y destinos',
        createdAt: '2025-12-11T05:10:34.000Z',
      },
    },
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles paginada',
    schema: {
      example: {
        data: [
          {
            id: '1',
            name: 'ADMIN',
            description: 'Control total del sistema',
          },
          {
            id: '2',
            name: 'AGENT',
            description: 'Puede gestionar reservas',
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
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filtrar roles por nombre (LIKE)',
    example: 'ADMIN',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de registros por página',
    example: 10,
  })
  findAll(@Query() query: FilterRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    schema: {
      example: {
        id: 1,
        name: 'ADMIN',
        description: 'Control total del sistema',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    description: 'Datos a actualizar',
    schema: {
      example: {
        name: 'VIEWER',
        description: 'Solo puede ver contenido',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado correctamente',
    schema: {
      example: {
        id: 1,
        name: 'VIEWER',
        description: 'Solo puede ver contenido',
        updatedAt: '2025-12-11T05:15:55.200Z',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado correctamente',
    schema: {
      example: {
        message: 'Role deleted successfully',
        id: 1,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
