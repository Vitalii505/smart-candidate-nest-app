import { Module } from '@nestjs/common';
import { ListApplyJobsController } from './list_apply_jobs.controller';
import { ListApplyJobsService } from './list_apply_jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListApplyEntity } from './entities/list_apply.entity';
import { HadleWebParserService } from 'src/handle_web_parser/handle_web_parser.service';
import { HandleQuestionsService } from 'src/handle_questions/handle_questions.service';

@Module({
  controllers: [ListApplyJobsController],
  providers: [ListApplyJobsService, HadleWebParserService, HandleQuestionsService],
  imports: [TypeOrmModule.forFeature([ListApplyEntity])],
})

export class ListApplyJobsModule {}