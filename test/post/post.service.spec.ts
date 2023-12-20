import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post} from "../../src/entities/post";
import {MockUserRepository} from "../../mocks/mock-user.repository";
import {PostService} from "../../src/post/post.service";
import {User} from "../../src/entities/user";
import {CreatePostDto} from "../../src/post/dto/create-post.dto";
import {CreateUserDto} from "../../src/user/dto/create-user.dto";


describe('PostService', () => {
    let postService: PostService;
    let postRepository: Repository<Post>;
    let userRepository: MockUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: getRepositoryToken(Post),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
            ],
        }).compile();

        postService = module.get<PostService>(PostService);
        postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
        userRepository = module.get<MockUserRepository>(getRepositoryToken(User));
    });

    describe('createPost', () => {
        it('should create and return a new post', async () => {
            const mockCreatePostDto: CreatePostDto = {
                content: 'testContent',
                mediaContentUrl: 'media.com',
            };

            const mockCreateUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };

            const mockUser: User = {
                id: 1,
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
                ...mockCreateUserDto,
            };

            const mockCreatedPost: Post = {
                id: 1,
                ...mockCreatePostDto,
                author: mockUser,
                comments: [],
            };


            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

            jest.spyOn(postRepository, 'create').mockReturnValueOnce(mockCreatedPost);
            jest.spyOn(postRepository, 'save').mockImplementationOnce(async (post) => post as Post);

            const result = await postService.createPost(mockCreatePostDto, mockUser);

            expect(result).toEqual(mockCreatedPost);
        });
    });

});