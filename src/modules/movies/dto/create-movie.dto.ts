import { IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { MoviesFormatEnum } from '../enum/movies-format.enum';

export class CreateMovieDto {
  @Length(1, 64)
  title: string;

  @IsEnum(MoviesFormatEnum)
  format: 'VHS' | 'DVD' | 'Blu-ray';

  @IsNumber()
  year: number;

  @IsString({ each: true })
  actors: string[];
}
