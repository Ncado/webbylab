import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ActorsModel } from '../actors/actors.model';
import { ActorsMoviesModel } from '../actors/actors-movies.model';
import { MoviesFormatEnum } from './enum/movies-format.enum';

@Table({ createdAt: true, updatedAt: true })
export class MoviesModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  title: string;

  @Column({
    type: DataType.ENUM(...Object.values(MoviesFormatEnum)),
  })
  format: MoviesFormatEnum;

  @Column
  year: number;

  @BelongsToMany(() => ActorsModel, () => ActorsMoviesModel)
  actors: ActorsModel[];
}
