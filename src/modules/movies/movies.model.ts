import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ActorsModel } from '../actors/actors.model';
import { ActorsMoviesModel } from '../actors/actors-movies.model';

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

  @Column
  format: number;

  @Column
  actors: string;

  @BelongsToMany(() => ActorsModel, () => ActorsMoviesModel)
  roles: ActorsModel[];
}
