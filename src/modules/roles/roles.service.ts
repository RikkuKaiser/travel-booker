import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { FilterRoleDto } from './dto/filter-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (exists) {
      throw new BadRequestException(
        `Role with name ${createRoleDto.name} already exists`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(query: FilterRoleDto) {
    const { name, page = 1, limit = 10 } = query;

    const qb = this.roleRepository
      .createQueryBuilder('role')
      .select(['role.id', 'role.name'])
      .orderBy('role.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (name) {
      qb.andWhere('role.name ILIKE :name', { name: `%${name}%` });
    }

    const [roles, total] = await qb.getManyAndCount();

    return {
      data: roles,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name !== undefined && updateRoleDto.name.trim() === '') {
      throw new BadRequestException('Role name must not be empty');
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const role = await this.findOne(id);

    await this.roleRepository.remove(role);

    return {
      message: 'Role deleted successfully',
      id,
    };
  }
}
