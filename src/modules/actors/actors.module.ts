import { Module } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ActorsModel } from './actors.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MoviesModel } from '../movies/movies.model';
import { ActorsMoviesModel } from './actors-movies.model';

@Module({
  providers: [ActorsService],
  exports: [ActorsService],
  imports: [
    SequelizeModule.forFeature([ActorsModel, MoviesModel, ActorsMoviesModel]),
  ],
})
export class ActorsModule {}
