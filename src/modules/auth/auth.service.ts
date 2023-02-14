import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../utils/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async sessions(): Promise<string> {
    const user = await this.usersService.getUserByEmail();
    if (!'user') {
      throw new BadRequestException(" User don't exist");
    }
    const isPasswordMatching = await this.passwordService.comparePassword(
      'loginDto.password',
      'user.password',
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const access_token = await this.issueToken('j');
    return access_token;
  }

  async issueToken(session): Promise<string> {
    return this.jwtService.sign({
      sessionID: session.sessionID,
    });
  }
}
