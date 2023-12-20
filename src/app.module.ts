import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm"
import {AuthModule} from "./auth/auth.module"
import {UserModule} from "./user/user.module"
import {User} from "./entities/user"
import {Post} from "./entities/post"
import {Comment} from "./entities/comment"
import {Conversation} from "./entities/conversation"
import {Message} from "./entities/message"
import {ModeratorModule} from "./moderator/moderator.module"
import {PostModule} from "./post/post.module"
import {CommentModule} from "./comment/comment.module"
import {ConversationModule} from "./conversation/conversation.module"
import {MessageModule} from "./message/message.module"

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env"}),
    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      url: process.env.POSTGRES_URL,
      ssl: {
        // @ts-ignore
        require: true,
     },
      entities: [User, Post, Comment, Conversation, Message],
    }),
    AuthModule,
    UserModule,
    ModeratorModule,
    PostModule,
    CommentModule,
    ConversationModule,
    MessageModule,
  ],
})
export class AppModule {
}
