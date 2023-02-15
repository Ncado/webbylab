import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { MoviesFormatEnum } from '../enum/movies-format.enum';

export class UpdateMovieDto {
  @IsOptional()
  @Length(1, 64)
  title: string;

  @IsOptional()
  @IsString()
  format: MoviesFormatEnum;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString({ each: true })
  actors: string[];
}
