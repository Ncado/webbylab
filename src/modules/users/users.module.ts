import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsModule } from '../../utils/utils.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([UsersModel]), UtilsModule],
  exports: [UsersService],
})
export class UsersModule {}
