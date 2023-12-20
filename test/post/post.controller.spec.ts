import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostController } from '../../src/post/post.controller';
import { PostService } from '../../src/post/post.service';
import { CreatePostDto } from '../../src/post/dto/create-post.dto';
import { User } from '../../src/entities/user';
import { Post } from '../../src/entities/post';
import { EditPostDto } from '../../src/post/dto/edit-post.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {JwtAuthGuard} from "../../src/auth/guards/jwt-auth.guard";
import {MockJwtAuthGuard} from "../../mocks/mock-jwt-auth.guard";


describe('PostController', () => {
    let postController: PostController;
    let postService: PostService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [
                PostService,
                {
                    provide: getRepositoryToken(Post),
                    useClass: Repository,
                },
                {
                    provide: JwtAuthGuard,
                    useClass: MockJwtAuthGuard,
                },
                {
                    provide: JwtService,
                    useClass: JwtService,
                },
            ],
        }).compile();

        postController = module.get<PostController>(PostController);
        postService = module.get<PostService>(PostService);
    });

    describe('createPost', () => {
        it('should create and return a new post', async () => {
            const mockCreatePostDto: CreatePostDto = {
                content: 'testContent',
                mediaContentUrl: 'media.com',
            };

            const mockUser: User = getMockUser();
            const mockCreatedPost: Post = getMockCreatedPost(mockCreatePostDto, mockUser);

            jest.spyOn(postService, 'createPost').mockResolvedValueOnce(mockCreatedPost);

            const request = {
                user: mockUser,
            };

            const result = await postController.createPost(mockCreatePostDto, request);

            expect(result).toEqual(mockCreatedPost);
        });
    });

    describe('editPost', () => {
        it('should throw an exception if the user does not have access to edit the post', async () => {
            const mockEditPostDto: EditPostDto = {
                id: 1,
                content: 'editedContent',
                mediaContentUrl: 'editedMedia.com',
            };

            const mockUser: User = getMockUser(2);

            jest.spyOn(postService, 'editPost').mockImplementation(() => {
                throw new HttpException('You have not access to this post', HttpStatus.NOT_ACCEPTABLE);
            });

            const request = {
                user: mockUser,
            };

            await expect(() => postController.editPost(request, mockEditPostDto)).toThrowError(
                new HttpException('You have not access to this post', HttpStatus.NOT_ACCEPTABLE),
            );
        });
    });
});

function getMockUser(id: number = 1): User {
    return {
        id,
        isBanned: false,
        role: 'user',
        posts: [],
        conversations: [],
        address: 'mockAddress',
        password: 'mockPassword',
        nickname: 'mockUser',
        avatar: 'mockAvatar',
    };
}

function getMockCreatedPost(mockCreatePostDto: CreatePostDto, mockUser: User): Post {
    return {
        id: 1,
        ...mockCreatePostDto,
        author: mockUser,
        comments: [],
    };
}