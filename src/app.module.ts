import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ActorsModule } from './modules/actors/actors.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    MoviesModule,
    ActorsModule,
    UtilsModule,
    SequelizeModule.forRootAsync(databaseConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
