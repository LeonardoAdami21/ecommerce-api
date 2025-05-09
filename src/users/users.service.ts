import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './prisma/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user',
      );
    }
  }

  async findById(userId: number) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user',
      );
    }
  }

  async me(userId: number) {
    try {
      const user = await this.userRepository.me(userId);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user',
      );
    }
  }
}
