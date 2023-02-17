import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionDto } from './dto/session.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseInterceptor } from '../../interceptors/responce.interceptor';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sessions')
  async sessions(@Body() sessionsDto: SessionDto) {
    const result = await this.authService.sessions(sessionsDto);
    return result;
  }

  @Post('users')
  create(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }
}
