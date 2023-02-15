import { IsNumber, IsString, Length } from 'class-validator';
import { MoviesFormatEnum } from '../enum/movies-format.enum';

export class CreateMovieDto {
  @Length(1, 64)
  title: string;

  @IsString()
  format: MoviesFormatEnum;

  @IsNumber()
  year: number;

  @IsString({ each: true })
  actors: string[];
}
