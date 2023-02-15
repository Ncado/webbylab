import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() dto: CreateMovieDto, @Req() req) {
    const result = await this.moviesService.createMovie(dto);
    return result;
  }

  @Patch(':id')
  async updateMovie(@Body() dto: UpdateMovieDto, @Param('id') id: number) {
    const result = await this.moviesService.updateMovie(dto, id);
    return result;
  }

  @Get()
  async getMovie(
    @Query('actor') actor: string,
    @Query('title') title: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const filetrs = {};
    if (actor) {
      filetrs['actor'] = actor;
    }
    if (title) {
      filetrs['title'] = title;
    }
    const result = await this.moviesService.getMovies(
      filetrs,
      sort,
      order,
      limit,
      offset,
    );
    return result;
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const result = await this.moviesService.getMovie(id);
    return result;
  }

  @Delete(':id')
  async deleteMovie(@Param('id') id: number) {
    const result = await this.moviesService.deleteMovie(id);
    return result;
  }
}
