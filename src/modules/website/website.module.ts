import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import { WebsiteController } from './website.controller';
import { Website } from './website.entity';
import { WebsiteService } from './website.service';

@Module({
  imports: [TypeOrmModule.forFeature([Website]), UserModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
