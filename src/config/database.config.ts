import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = registerAs(
  'databaseConfig',
  (): SequelizeModuleOptions => ({
    dialect: 'sqlite',
    storage: './database:/var/lib/sqlite/data',
    username: 'sqlite',
    database: 'sqlite',
    password: 'sqlite',
    autoLoadModels: true,
    synchronize: true,
  }),
);
