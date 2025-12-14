/* eslint-disable @typescript-eslint/require-await */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser, LoginResponse } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) return null;

      const roles = user.userRoles?.map((ur) => ur.role.name) || [];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to validate user: ${message}`,
      );
    }
  }

  async login(user: AuthenticatedUser): Promise<LoginResponse> {
    try {
      const payload = { sub: user.id, email: user.email, roles: user.roles };

      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '15m',
        }),
        user,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to generate token: ${message}`,
      );
    }
  }
}
