import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Env } from '../utils/validate-env';

export const databaseConfig = registerAs(
  'databaseConfig',
  (): SequelizeModuleOptions => ({
    dialect: 'sqlite',
    storage: Env.string('DB_STORAGE'),
    username: Env.string('DB_USERNAME'),
    database: Env.string('DB_DATABASE'),
    password: Env.string('DB_PASSWORD'),
    autoLoadModels: true,
    synchronize: true,
  }),
);
