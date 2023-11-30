import { Module } from '@nestjs/common';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user";
import {JwtModule} from "@nestjs/jwt";
import {MessageController} from "./message.controller";
import {MessageService} from "./message.service";

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
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
