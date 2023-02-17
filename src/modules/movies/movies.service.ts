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

  async getMovieByTitle(value: string) {
    const movie = await this.moviesRepository.findOne({
      where: { title: value },
    });
    return movie;
  }

  async getMovieById(value: number) {
    const movie = await this.moviesRepository.findOne({
      where: { id: value },
    });
    return movie;
  }

  async createMovie(dto: CreateMovieDto) {
    if (await this.getMovieByTitle(dto.title)) {
      throw new BadRequestException('MOVIE_EXISTS');
    }

    const arr = [];
    const resActors = [];

    dto?.actors?.forEach((element) => {
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
    try {
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
      return { data: curMovie };
    } catch (e) {
      console.log('->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>', e);
      console.log('->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>', {
        ...dto,
      });

      return e;
    }
  }

  async getMovies<Key extends keyof MoviesModel>(
    actor,
    title,
    sort,
    order,
    limit,
    offset,
  ) {
    const movie = await this.moviesRepository.findAndCountAll({
      where: title,

      order: [[sort, order]],
      include: [
        {
          model: ActorsModel,
          attributes: [],
          through: {
            attributes: [],
          },
          where: actor,
        },
      ],
      limit: limit,
      offset: offset,
      distinct: true,
    });

    return { data: movie.rows, meta: { total: movie.count } };
  }

  async getMovie(movieId) {
    const movie = await this.moviesRepository.findOne({
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

    if (!movie) {
      throw new BadRequestException('MOVIE_NOT_FOUND');
    }
    return { data: movie };
  }

  async updateMovie(dto: UpdateMovieDto, id: number) {
    const movie = await this.moviesRepository.findOne({ where: { id: id } });
    if (!movie) {
      throw new BadRequestException('MOVIE_NOT_FOUND');
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
    return { data: curMovie };
  }

  async deleteMovie(movieId: number) {
    if (await this.getMovieById(movieId)) {
      return await this.moviesRepository.destroy({
        where: {
          id: movieId,
        },
      });
    }
    throw new BadRequestException('MOVIE_NOT_FOUND');
  }

  async import(str: string) {
    const arr = str
      .split('\n')
      .map((i) => i.split(': '))
      .reduce(
        (a, [k, v]) => ((!v && a.push({})) || (a[a.length - 1][k] = v), a),
        [{}],
      );
    arr.forEach((element, index) => {
      if (JSON.stringify(element) != '{}') {
        element['title'] = element['Title'];
        element['year'] = element['Release Year'];
        element['format'] = element['Format'];
        element['actors'] = element['Stars']?.split(', ');

        delete element['Title'];
        delete element['Release Year'];
        delete element['Format'];
        delete element['Stars'];
      }
      if (JSON.stringify(element) == '{}') {
        arr.splice(index, 1);
      }
    });
    try {
      for (const element of arr) {
        await this.createMovie(element as CreateMovieDto);
      }
      return {
        data: 2222,
        // meta: {
        //   imported: arr.length,
        //   total: 33,
        // },
      };
    } catch (e) {
      return {
        data: arr,
        meta: {
          imported: arr.length,
          total: await this.moviesRepository.count(),
        },
      };
    }
  }
}
