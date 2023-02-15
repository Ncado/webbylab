import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  get() {
    return this.usersService.getUser();
  }

  @Post('/vd')
  getByValue() {
    return this.usersService.getUserByEmail('stribabbajabbng@gmail.com');
  }
}
