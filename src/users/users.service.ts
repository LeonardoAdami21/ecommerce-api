import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from './mongo/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEnumType } from './schema/user.schema';
import { JwtStrategy } from './guards/jwt.strategy';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { environment } from '../env/envoriment';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterUserDto) {
    const { name, email, password, role } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const users = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      role: role || UserEnumType.USER,
      passwordConfirmation: hashedPassword,
      confirmationToken: confirmationToken,
      recoveryToken: null,
    });
    await this.mailService.sendMail({
      to: email,
      from: 'noreply@application.com',
      subject: 'Confirm your account',
      html: `<a href="http://localhost:3000/users/confirm-email/${confirmationToken}">Confirm your email</a>`,
      template: 'email-confirmation',
      context: {
        token: users.confirmationToken,
      },
    });
    if (dto.password !== dto.passwordConfirmation) {
      throw new UnprocessableEntityException(
        'Password confirmation is incorrect',
      );
    }
    return users;
  }

  async login(dto: LoginUserDto) {
    const { email, password } = dto;
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (user == null) {
      throw new UnauthorizedException('Credentials not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Passwords not match');
    }
    const payload = await this.jwtStrategy.validate(user);
    const token = this.jwtService.sign(payload, {
      secret: environment.JWT_SECRET,
      expiresIn: '1d',
    });
    return { access_token: token, id: user._id };
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name, email, role } = dto;
    user.name = name;
    user.email = email;
    user.role = role ? role : user.role;
    try {
      await this.usersRepository.update(id, dto);
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.usersRepository.delete(id);
      return {
        message: 'User removed successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async confirmEmail(confirmationToken: string) {
    const user = await this.usersRepository.confirmEmail(confirmationToken);
    if (!user) {
      throw new NotFoundException('Confirmation token not found');
    }
    return await this.usersRepository.updateConfirmationToken(
      user.id,
      confirmationToken,
    );
  }

  async sendRecoveryPasswordEmail(email: string): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const recoverToken = (user.recoveryToken = crypto
      .randomBytes(32)
      .toString('hex'));
    await this.usersRepository.sendRecoveryPasswordEmail(email, recoveryToken);
    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      html: `<a href="http://localhost:3000/users/reset-password/${recoveryToken}">Reset your password</a>`,
      template: 'recover-password',
      context: {
        token: user.recoveryToken,
      },
    };
    await this.mailService.sendMail(mail);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDTo,
  ) {
    const user = await this.usersRepository.findByRecoverToken(recoverToken);
    if (!user) {
      throw new NotFoundException('Recover token not found');
    }
    try {
      await this.changePassword(user, changePasswordDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(id: number, dto: ChangePasswordDTo) {
    const { password, passwordConfirmation } = dto;
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Password dosent matches');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await this.usersRepository.changePassword(id, hashedPassword);
  }
}
