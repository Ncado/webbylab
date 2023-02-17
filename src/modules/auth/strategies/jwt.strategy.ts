import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { authConfig } from '../../../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.headers.authorization) {
      const res = req.headers.authorization.split(' ');
      return res[1];
    }
    return null;
  }

  async validate(validationPayload: { email: string }) {
    const session = await this.usersService.getUserByEmail(
      validationPayload.email,
    );
    if (!session) {
      throw new BadRequestException('AUTHENTICATION_FAILED');
    }

    return await this.usersService.getUser();
  }
}
