import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../../utils/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
    private readonly passwordService: PasswordService,
  ) {}

  async getUser() {
    const role = await this.userRepository.findAll();
    return role;
  }

  async getUserByEmail(value: string) {
    const user = await this.userRepository.findOne({
      where: { email: value },
    });
    return user;
  }

  async createUser(createUserData: CreateUserDto) {
    const bycriptedPassword = await this.passwordService.hashPassword(
      createUserData.password,
    );
    const user = await this.userRepository.create({
      ...createUserData,
      password: bycriptedPassword,
    });
    return user;
  }
}
