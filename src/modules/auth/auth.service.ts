import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../utils/password.service';
import { SessionDto } from './dto/session.dto';
import { UsersModel } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async sessions(sessionsDto: SessionDto): Promise<string> {
    const user = await this.usersService.getUserByEmail(sessionsDto.email);
    if (!user) {
      throw new BadRequestException(" User don't exist");
    }
    const isPasswordMatching = await this.passwordService.comparePassword(
      sessionsDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
    delete user.dataValues['password'];
    const access_token = await this.issueToken(user.dataValues);
    return access_token;
  }

  async issueToken(data: Omit<UsersModel, 'password'>): Promise<string> {
    return this.jwtService.sign({
      ...data,
    });
  }
}
