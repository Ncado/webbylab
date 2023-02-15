import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { MoviesModel } from './movies.model';
import { ActorsService } from '../actors/actors.service';
import { ActorsModel } from '../actors/actors.model';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private actorsService: ActorsService,
    @InjectModel(MoviesModel) private moviesRepository: typeof MoviesModel,
  ) {}

  async createMovie(dto: CreateMovieDto) {
    const arr = [];
    const resActors = [];

    dto.actors.forEach((element) => {
      const x = this.actorsService.createActor(element);
      arr.push(x);
    });
    await Promise.all(arr).then(() => {
      arr.forEach((element) => {
        element.then((value) => {
          resActors.push(value);
        });
      });
    });

    const movie = await this.moviesRepository.create({
      ...dto,
    });
    await movie.$add('actors', resActors);
    const curMovie = await this.moviesRepository.findOne({
      where: { id: movie.id },
      include: [
        {
          model: ActorsModel,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return curMovie;
  }

  async getMovies<Key extends keyof MoviesModel>(
    findFields,
    sort?: Key,
    order = 'ASC',
    limit = 5,
    offset = 0,
  ) {
    return await this.moviesRepository.findAll({
      where: findFields,

      order: [[sort, order]],
      include: [
        {
          model: ActorsModel,
          through: {
            attributes: [],
          },
        },
      ],
      limit: limit,
      offset: offset,
    });
  }

  async getMovie(movieId) {
    return await this.moviesRepository.findOne({
      where: { id: movieId },
      include: [
        {
          model: ActorsModel,
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  async updateMovie(dto: UpdateMovieDto, id: number) {
    const movie = await this.moviesRepository.findOne({ where: { id: id } });
    if (!movie) {
      throw new BadRequestException("you can't modify");
    }
    const arr = [];
    const resActors = [];

    const updateRes = await this.moviesRepository.update(dto, {
      where: { id: id },
    });

    dto.actors.forEach((element) => {
      const x = this.actorsService.createActor(element);
      arr.push(x);
    });

    await Promise.all(arr).then(() => {
      arr.forEach((element) => {
        element.then((value) => {
          resActors.push(value);
        });
      });
    });

    await movie.$set('actors', resActors);
    const curMovie = await this.moviesRepository.findOne({
      where: { id: movie.id },
      include: [
        {
          model: ActorsModel,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return curMovie;
  }

  async deleteMovie(movieId) {
    return await this.moviesRepository.destroy({
      where: {
        id: movieId,
      },
    });
  }
}
