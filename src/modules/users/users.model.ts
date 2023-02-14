import { Column, Model, Table } from 'sequelize-typescript';

@Table({ createdAt: true, updatedAt: true })
export class UsersModel extends Model {
  @Column({ primaryKey: true })
  id: number;
  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;
}
