import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../interceptors/responce.interceptor';
import { extname } from 'path';

@Controller('movies')
@UseInterceptors(ResponseInterceptor)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(
    FileInterceptor('movies', {
      fileFilter: (req, file, callback) => {
        if (extname(file.originalname) !== '.txt') {
          callback(new BadRequestException('ONLY_TXT_FILE_ALLOWED'), true);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.moviesService.import(file.buffer.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMovie(@Body() dto: CreateMovieDto, @Req() req) {
    const result = await this.moviesService.createMovie(dto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMovie(@Body() dto: UpdateMovieDto, @Param('id') id: number) {
    const result = await this.moviesService.updateMovie(dto, id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMovie(
    @Query('actor') actor: string,
    @Query('title') title: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    const actorObj = {};
    const titleObj = {};
    // const searchObj = {};

    if (actor) {
      actorObj['name'] = actor;
    }
    if (title) {
      titleObj['title'] = title;
    }
    // if (title) {
    //   searchObj['title'] = search ?? title;
    // }
    console.log('___________+++++', actorObj['name']);
    console.log('___________', titleObj['title']);

    const result = await this.moviesService.getMovies(
      actorObj,
      titleObj,
      search,
      sort ?? 'id',
      order ?? 'ASC',
      limit ?? 5,
      offset ?? 0,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id') id: number) {
    const result = await this.moviesService.getMovie(id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMovie(@Param('id') id: number) {
    const result = await this.moviesService.deleteMovie(id);
    return result;
  }
}
