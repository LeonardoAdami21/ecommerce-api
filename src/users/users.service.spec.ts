// src/products/products.service.spec.ts
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConfigModule } from '../config/prisma.config.module';
import { UserRepository } from './prisma/user.repository';
import { usersProvider } from './provider/user.provider';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaConfigModule],
      providers: [UsersService, ...usersProvider, UserRepository],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Find User Profile', () => {
    it('should return user ', async () => {
      const user = await usersService.findById(3);
      expect(user).toBeDefined();
    });
  });
});
