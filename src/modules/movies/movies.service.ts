import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { MoviesModel } from './movies.model';
import { ActorsService } from '../actors/actors.service';
import { ActorsModel } from '../actors/actors.model';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Op } from 'sequelize';

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
    search,
    sort,
    order,
    limit,
    offset,
  ) {
    if (search) {
      const movie2 = await this.moviesRepository.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.eq]: search,
              },
            },
            {
              '$actors.name$': {
                [Op.eq]: search,
              },
            },
          ],
        },

        order: [[sort, order]],
        include: [
          {
            model: ActorsModel,
            attributes: [],
            through: {
              attributes: [],
            },
            as: 'actors',
          },
        ],
        limit: limit,
        subQuery: false,
        offset: offset,
        distinct: true,
      });
      return { data: movie2.rows, meta: { total: movie2.count } };
    }
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
      } else {
        arr[index] = undefined;
      }
    });
    let result = arr.filter((item) => item);

    for (const [index, value] of result.entries()) {
      //console.log('))))))))>', value);
      try {
        await this.createMovie(value as CreateMovieDto);
      } catch (e) {
        result[index] = undefined;
      }
    }
    result = result.filter((item) => item);

    return {
      data: result,
      meta: {
        imported: result.length,
        total: await this.moviesRepository.count(),
      },
    };
  }
}
