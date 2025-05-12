import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterAuthDto } from './dto/register.auth-dto';
import { LoginAuthDto } from './dto/login.auth-dto';
import { jwtExpiresIn, jwtSecret } from 'src/env/envoriment';
import { IPayload } from 'src/interface/IPayload';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    const isMatch = await argon2.verify(user.password, pass);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: RegisterAuthDto) {
    try {
      const { name, email, password } = dto;
      if (!name || !email || !password) {
        throw new BadRequestException('Invalid data provided');
      }
      const hashPassword = await argon2.hash(password);
      const user = await this.usersService.create({
        name,
        email,
        password: hashPassword,
      });
      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
        error,
      );
    }
  }

  async login(dto: LoginAuthDto) {
    try {
      const { email, password } = dto;
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload: IPayload = {
        email: user.email,
        name: user.name,
        id: user.id,
        roles: Array.isArray(user.userRole)
          ? user.userRole
          : [user.userRole || 'user'],
      };
      const token = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
        algorithm: 'HS256',
      });
      return {
        message: 'User login successfully',
        access_token: token,
        roles: Array.isArray(user.userRole)
          ? user.userRole
          : [user.userRole || 'user'],
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while login the user',
        error,
      );
    }
  }
}
