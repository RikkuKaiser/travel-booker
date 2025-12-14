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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { FilterUsersDto } from './dto/filter-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiBody({
    description: 'Datos para crear usuario',
    schema: {
      example: {
        name: 'Juan Pérez',
        email: 'juan.perez@mail.com',
        password: 'MiPassword123',
        roles: ['AGENT'],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado',
    schema: {
      example: {
        id: 'uuid-generado',
        name: 'Juan Pérez',
        email: 'juan.perez@mail.com',
        roles: ['AGENT'],
        createdAt: '2025-12-11T02:33:01.200Z',
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Obtiene todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con paginación',
    schema: {
      example: {
        data: [
          {
            id: 'uuid1',
            name: 'Juan Pérez',
            email: 'juan@mail.com',
            roles: ['ADMIN'],
          },
          {
            id: 'uuid2',
            name: 'María López',
            email: 'maria@mail.com',
            roles: ['AGENT'],
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
  findAll(@Query() query: FilterUsersDto) {
    return this.usersService.findAll(query);
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    schema: {
      example: {
        id: 'uuid1',
        name: 'Juan Pérez',
        email: 'juan@mail.com',
        roles: ['VIEWER'],
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza datos del usuario (sin roles) (ADMIN)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    type: 'string',
  })
  @ApiBody({
    description: 'Campos a modificar',
    schema: {
      example: {
        name: 'Nuevo Nombre',
        email: 'nuevo.correo@mail.com',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
    schema: {
      example: {
        id: 'uuid1',
        name: 'Nuevo Nombre',
        email: 'nuevo.correo@mail.com',
        roles: ['VIEWER'],
        updatedAt: '2025-12-11T03:00:00.121Z',
      },
    },
  })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Roles('ADMIN')
  @Patch(':id/roles')
  @ApiOperation({
    summary: 'Actualiza roles del usuario (ADMIN)',
    description:
      'Permite asignar, reemplazar o eliminar roles. Solo accesible para ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    type: 'string',
  })
  @ApiBody({
    description: 'Roles a asignar al usuario',
    schema: {
      example: {
        roles: ['ADMIN', 'AGENT'],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Roles actualizados correctamente',
    schema: {
      example: {
        id: 'uuid1',
        name: 'Juan Pérez',
        email: 'juan@mail.com',
        roles: ['ADMIN', 'AGENT'],
        updatedAt: '2025-12-11T03:10:10.900Z',
      },
    },
  })
  updateUserRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    return this.usersService.updateUserRoles(id, dto.roles);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado',
    schema: {
      example: {
        message: 'Usuario eliminado correctamente',
        id: 'uuid1',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
