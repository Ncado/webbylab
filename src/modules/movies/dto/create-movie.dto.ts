import { IsArray, IsEnum, IsInt, Length, Max, Min } from 'class-validator';
import { MoviesFormatEnum } from '../enum/movies-format.enum';
import { EachNotContainsSymbol } from '../../../decorators/blocked-symbol.decorator';
import { NotOnlySpacesDecorator } from '../../../decorators/not-only-spaces.decorator';

export class CreateMovieDto {
  @NotOnlySpacesDecorator({
    message: 'not only spaces',
  })
  @Length(1, 64)
  title: string;

  @IsEnum(MoviesFormatEnum)
  format: 'VHS' | 'DVD' | 'Blu-ray';

  @IsInt()
  @Min(1850)
  @Max(2021)
  year: number;

  @IsArray()
  @EachNotContainsSymbol('!"N°;%:?*()_+', {
    message: 'contain not allowed symbols !"N°;%:?*()_+',
  })
  actors: string[];
}
