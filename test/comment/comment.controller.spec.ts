import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../../src/comment/comment.controller';
import {User} from "../../src/entities/user";
import {CommentService} from "../../src/comment/comment.service";
import {CreateCommentDto} from "../../src/comment/dto/create-comment.dto";
import {JwtService} from "@nestjs/jwt";
import {mockedJwtService} from "../../mocks/mock-jwt.service";
import {MockJwtAuthGuard} from "../../mocks/mock-jwt-auth.guard";
import {PostService} from "../../src/post/post.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {MockUserRepository} from "../../mocks/mock-user.repository";
import {MockCommentRepository} from "../../mocks/mock-comment.repository";
import {HttpException, HttpStatus} from "@nestjs/common";
import { Comment } from "../../src/entities/comment";
import {Post} from "../../src/entities/post";
import {MockPostRepository} from "../../mocks/mock-post.repository";

describe('CommentController', () => {
    let controller: CommentController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [
                CommentService,
                PostService,
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
                MockJwtAuthGuard,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
                {
                    provide: getRepositoryToken(Comment),
                    useClass: MockCommentRepository,
                },
                {
                    provide: getRepositoryToken(Post),
                    useClass: MockPostRepository,
                },
            ],
        }).compile();

        controller = (await module.resolve<CommentController>(CommentController)) as CommentController;
    });

    describe('createComment', () => {
        it('should create a comment', async () => {
            const dto: CreateCommentDto = {
                content: 'testContent',
                postId: 1,
            };

            jest.spyOn(controller['commentService'], 'createComment').mockResolvedValueOnce(Promise.resolve(new Comment() as Comment));

            const result = await controller.createComment(dto, { user: new User() });

            expect(result).toBeDefined();
            expect(controller['commentService'].createComment).toHaveBeenCalledWith(dto, expect.any(User));
        });

        it('should throw HttpException if creation fails', async () => {
            const dto: CreateCommentDto = {
                content: 'testContent',
                postId: 1,
            };

            jest.spyOn(controller['commentService'], 'createComment').mockRejectedValueOnce(
                new HttpException('Comment creation failed', HttpStatus.INTERNAL_SERVER_ERROR),
            );

            await expect(controller.createComment(dto, { user: new User() })).rejects.toThrowError(
                new HttpException('Comment creation failed', HttpStatus.INTERNAL_SERVER_ERROR),
            );
            expect(controller['commentService'].createComment).toHaveBeenCalledWith(dto, expect.any(User));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});