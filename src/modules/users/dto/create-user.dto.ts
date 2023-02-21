import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { NotOnlySpacesDecorator } from '../../../decorators/not-only-spaces.decorator';

export class CreateUserDto {
  @Length(1, 64)
  @NotOnlySpacesDecorator({
    message: 'not only spaces',
  })
  name: string;

  @IsEmail()
  @Length(1, 64)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Length(1, 64)
  password: string;
  @Length(1, 64)
  confirmPassword: string;
}
