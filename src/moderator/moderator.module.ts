import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports : [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY',
      signOptions: {
        expiresIn: '8h',
      },
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
})
export class ModeratorModule {}
