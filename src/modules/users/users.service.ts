import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async getUser() {
    return 1;
  }

  async getUserByEmail() {
    return 1;
  }
}
