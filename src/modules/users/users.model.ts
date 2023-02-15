import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ createdAt: true, updatedAt: true })
export class UsersModel extends Model<UsersModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column
  password: string;
}
