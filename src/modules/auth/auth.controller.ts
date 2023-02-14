import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionDto } from './dto/session.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sessions')
  async sessions(@Body() sessionsDto: SessionDto, @Req() req): Promise<string> {
    const result = await this.authService.sessions();
    return result;
  }
}
