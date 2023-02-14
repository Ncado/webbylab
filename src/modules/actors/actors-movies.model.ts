import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { MoviesModel } from '../movies/movies.model';
import { ActorsModel } from './actors.model';

@Table({ tableName: 'user_roles', createdAt: false, updatedAt: false })
export class ActorsMoviesModel extends Model<ActorsMoviesModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => MoviesModel)
  @Column({ type: DataType.INTEGER })
  movieId: number;

  @ForeignKey(() => ActorsModel)
  @Column({ type: DataType.INTEGER })
  actorId: number;
}
