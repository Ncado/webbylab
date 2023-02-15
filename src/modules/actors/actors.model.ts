import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { MoviesModel } from '../movies/movies.model';
import { ActorsMoviesModel } from './actors-movies.model';

@Table({ createdAt: true, updatedAt: true })
export class ActorsModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @BelongsToMany(() => MoviesModel, () => ActorsMoviesModel) ç;
  movies: MoviesModel[];
}
