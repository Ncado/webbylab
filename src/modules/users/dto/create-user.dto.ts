import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Length(1, 64)
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
