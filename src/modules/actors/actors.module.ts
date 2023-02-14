import { Module } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ActorsModel } from './actors.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [ActorsService],
  exports: [ActorsService],
  imports: [SequelizeModule.forFeature([ActorsModel])],
})
export class ActorsModule {}
