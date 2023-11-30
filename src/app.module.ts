import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './entities/user';
import { Post } from './entities/post';
import { Comment } from './entities/comment';
import { Conversation } from './entities/conversation';
import { Message } from './entities/message';
import { ModeratorModule } from './moderator/moderator.module';
import {ConversationModule} from "./messenger/conversation.module";
import {MessageModule} from "./messenger/message.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      url: process.env.POSTGRES_URL,
      entities: [User, Post, Comment, Conversation, Message],
    }),
    AuthModule,
    UserModule,
    ModeratorModule,
    ConversationModule,
    MessageModule
  ],
})
export class AppModule {}
