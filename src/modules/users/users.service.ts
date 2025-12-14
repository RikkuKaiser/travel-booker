import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { FilterUsersDto } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const { password, roles = ['VIEWER'], ...rest } = createUserDto;

    const user = this.userRepository.create({
      ...rest,
      passwordHash: await bcrypt.hash(password, 10),
    });

    const savedUser = await this.userRepository.save(user);

    const validRoles = await this.validateAndGetRoles(roles);

    for (const role of validRoles) {
      const newUserRole = this.userRoleRepository.create({
        user: savedUser,
        role,
        userId: savedUser.id,
        roleId: role.id,
      });
      await this.userRoleRepository.save(newUserRole);
    }

    const createdUser = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!createdUser) {
      throw new InternalServerErrorException(
        'Failed to fetch the created user',
      );
    }

    const rolesArray = this.mapUserRoles(createdUser);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      roles: rolesArray,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    } as unknown as User;
  }

  async findAll(query: FilterUsersDto) {
    const { status, role, page = 1, limit = 10 } = query;

    const qb = this.userRepository
      .createQueryBuilder('users')
      .leftJoin('users.userRoles', 'userRoles')
      .leftJoin('userRoles.role', 'role')
      .select(['users.id', 'users.name', 'users.email', 'role.name'])
      .orderBy('users.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      qb.andWhere('users.status = :status', { status });
    }

    if (role) {
      qb.andWhere('role.name = :role', { role });
    }

    type RawUserRow = {
      users_id: string;
      users_name: string;
      users_email: string;
      role_name: string | null;
    };

    const rawUsers: RawUserRow[] = await qb.getRawMany();

    const data = rawUsers.reduce(
      (acc, row) => {
        let user = acc.find((u) => u.id === row.users_id);
        if (!user) {
          user = {
            id: row.users_id,
            name: row.users_name,
            email: row.users_email,
            roles: [],
          };
          acc.push(user);
        }
        if (row.role_name && !user.roles.includes(row.role_name)) {
          user.roles.push(row.role_name);
        }
        return acc;
      },
      [] as { id: string; name: string; email: string; roles: string[] }[],
    );

    const totalQb = this.userRepository.createQueryBuilder('users');
    if (status) {
      totalQb.andWhere('users.status = :status', { status });
    }
    if (role) {
      totalQb
        .leftJoin('users.userRoles', 'userRoles')
        .leftJoin('userRoles.role', 'role')
        .andWhere('role.name = :role', { role });
    }
    const total = await totalQb.getCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(
    id: string,
  ): Promise<{ id: string; name: string; email: string; roles: string[] }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email'],
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const roles = this.mapUserRoles(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, status: 'ACTIVE' },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<{
    id: string;
    name: string;
    email: string;
    roles: string[];
    updatedAt: Date;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...rest } = dto;

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);
    await this.userRepository.save(user);

    const roles = this.mapUserRoles(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserRoles(
    id: string,
    roles: string[],
  ): Promise<{
    id: string;
    name: string;
    email: string;
    roles: string[];
    updatedAt: Date;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const validRoles = await this.validateAndGetRoles(roles);

    if (user.userRoles?.length > 0) {
      await this.userRoleRepository.remove(user.userRoles);
    }

    for (const role of validRoles) {
      const newUserRole = this.userRoleRepository.create({
        user,
        role,
        userId: id,
        roleId: role.id,
      });
      await this.userRoleRepository.save(newUserRole);
    }

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!updatedUser) {
      throw new NotFoundException(
        `User with id ${id} not found after updating roles`,
      );
    }
    const rolesArray = updatedUser.userRoles?.map((ur) => ur.role.name) ?? [];

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      roles: rolesArray,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
  }

  private async validateAndGetRoles(roleNames: string[]) {
    if (!roleNames || roleNames.length === 0) {
      throw new BadRequestException('Roles array cannot be empty');
    }

    const validRoles = await this.roleRepository.find({
      where: roleNames.map((name) => ({ name })),
    });

    const validNames = validRoles.map((r) => r.name);
    const invalidRoles = roleNames.filter((r) => !validNames.includes(r));

    if (invalidRoles.length > 0) {
      throw new BadRequestException(
        `These roles do not exist: ${invalidRoles.join(', ')}`,
      );
    }

    return validRoles;
  }

  private mapUserRoles(user: User) {
    return user.userRoles?.map((ur) => ur.role.name) ?? [];
  }
}
