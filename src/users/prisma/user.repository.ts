import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USER__REPOSITORY } from '../provider/user.provider';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER__REPOSITORY)
    private readonly userRepository: PrismaClient['user'],
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const { name, email, password } = dto;
      if (!name || !email || !password) {
        throw new BadRequestException('Invalid data provided');
      }
      const emailExists = await this.userRepository.findUnique({
        where: { email },
      });
      if (emailExists) {
        throw new ConflictException('User with this email already exists');
      }
      const user = await this.userRepository.create({
        data: {
          name,
          email,
          password,
          userRole: ['user'],
        },
      });
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data provided');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the user',
          error,
        );
      }
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.findMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found', error);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while retrieving the user',
          error,
        );
      }
    }
  }

  async findById(userId: number) {
    try {
      const user = await this.userRepository.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while retrieving the user',
        );
      }
    }
  }

  async me(id: number) {
    try {
      const user = await this.userRepository.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
          userRole: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while retrieving the user',
        );
      }
    }
  }
}
