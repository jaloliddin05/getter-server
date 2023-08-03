import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import configuration from './config';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { MailModule } from './modules/mail/mail.module';
import { OrderModule } from './modules/order/order.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { PositionModule } from './modules/position/position.module';
import { UserModule } from './modules/user/user.module';
import { WebsiteModule } from './modules/website/website.module';
import { RepliedCommentModule } from './modules/replied-comment/replied-comment.module';
import { OurServiceModule } from './modules/our-service/our-service.module';
import { SubServiceModule } from './modules/sub-service/sub-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    AuthModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    MailModule,
    OrderModule,
    OurServiceModule,
    PortfolioModule,
    PositionModule,
    RepliedCommentModule,
    SubServiceModule,
    UserModule,
    WebsiteModule,
  ],
})
export class AppModule {}
