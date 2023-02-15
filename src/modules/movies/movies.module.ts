import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ActorsModule } from '../actors/actors.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { MoviesModel } from './movies.model';
import { ActorsModel } from '../actors/actors.model';
import { ActorsMoviesModel } from '../actors/actors-movies.model';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    ActorsModule,
    SequelizeModule.forFeature([MoviesModel, ActorsModel, ActorsMoviesModel]),
  ],
})
export class MoviesModule {}
