import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { FileEntity } from './files/entities/file.entity';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { ListApplyJobsModule } from './list-apply-jobs/list_apply_jobs.module';
import { ListApplyEntity } from './list-apply-jobs/entities/list_apply.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, FileEntity, ListApplyEntity],
      synchronize: true,
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    ListApplyJobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
