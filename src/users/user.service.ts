import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USER_MODEL } from './providers/model.provider';
import { User } from './providers/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@Inject(USER_MODEL) private readonly userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    try {
      const { name, email, password } = dto;
      const userEmail = await this.userModel.findOne({
        email,
      });
      if (userEmail) {
        throw new ConflictException('Email already exists');
      }
      const hashPassword = await argon2.hash(password);
      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        role: 'user',
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async fidOneByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserById(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserIsActivated(id: string) {
    try {
      const user = await this.userModel.findById(id , { isActive: true });
      if (!user) {
        return false;
      }
      return user.isActive;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async finAlldCarts(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.cartItems;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async totalUsers(){
    try {
      const total = await this.userModel.countDocuments();
      return total;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
