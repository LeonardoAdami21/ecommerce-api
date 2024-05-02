import { RegisterUserDto } from '../dto/register-user.dto';
//import { UpdateUserDto } from '../dto/updade-user.dto';
import { User } from '../schema/user.schema';

export interface UserRepositoryInterface {
  create(dto: RegisterUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findByRecoverToken(confirmationToken: string): Promise<User>;
  confirmEmail(confirmationToken: string): Promise<any>;
  changePassword(id: number, password: string): Promise<User>;
  updateConfirmationToken(id: number, confirmationToken: string): Promise<User>;
  sendRecoveryPasswordEmail(email: string, recoverToken: string): Promise<any>;
  findById(id: number): Promise<User>;
  //update(id: number, dto: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<User>;
}
