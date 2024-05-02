import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
//import { UpdateUserDto } from '../dto/updade-user.dto';
import * as crypto from 'crypto';
import { Mongoose } from 'mongoose';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';
import { UserRepositoryInterface } from './user.repositoy.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject('dbclient') private readonly dbClienbt: Mongoose) {}

  private readonly usersRepository = this.dbClienbt.model('Users');

  async create(dto: RegisterUserDto): Promise<User> {
    return await this.usersRepository.create({
      data: dto,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name, email } = dto;
    user.name = name;
    user.email = email;
    try {
      await this.usersRepository.findByIdAndUpdate({
        where: {
          id: id,
        },
        data: user,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async changePassword(id: number, password: string): Promise<User> {
    const user = await this.usersRepository.findById({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = password;
    try {
      await this.usersRepository.findByIdAndUpdate({
        where: {
          id: id,
        },
        data: user,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findByRecoverToken(recoverToken: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        recoverToken: recoverToken,
      },
    });
  }

  async confirmEmail(confirmationToken: string): Promise<any> {
    return await this.usersRepository.findOne({
      where: {
        confirmationToken: confirmationToken,
      },
    });
  }

  async sendRecoveryPasswordEmail(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const recoverToken = (user.recoverToken = crypto
      .randomBytes(32)
      .toString('hex'));
    await this.usersRepository.findByIdAndUpdate({
      where: {
        id: user.id,
      },
      data: {
        recoverToken: recoverToken,
      },
    });
  }

  async delete(id: number): Promise<User> {
    const user = await this.usersRepository.findById({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.usersRepository.findByIdAndDelete({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async updateConfirmationToken(id: number, confirmationToken: string) {
    return await this.usersRepository.findByIdAndUpdate({
      where: {
        id: id,
      },
      data: {
        confirmationToken: confirmationToken,
      },
    });
  }
}
