import { Test, TestingModule } from '@nestjs/testing';
import {User} from "../../src/entities/user";
import {CommentService} from "../../src/comment/comment.service";
import {CreateCommentDto} from "../../src/comment/dto/create-comment.dto";
import {PostService} from "../../src/post/post.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import { Comment } from "../../src/entities/comment";
import {Repository} from "typeorm";
import {MockCommentRepository} from "../../mocks/mock-comment.repository";
import {MockPostService} from "../../mocks/mock-post.service";


describe('CommentService', () => {
    let commentService: CommentService;
    let commentRepository: Repository<Comment>;
    let postService: PostService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                PostService,
                {
                    provide: getRepositoryToken(Comment),
                    useClass: MockCommentRepository,
                },
                {
                    provide: PostService,
                    useClass: MockPostService,
                },
            ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
        commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
        postService = module.get<PostService>(PostService);
    });

    it('should be defined', () => {
        expect(commentService).toBeDefined();
    });

    describe('createComment', () => {
        it('should create a comment', async () => {
            const mockUser: User = {
                id: 1,
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
                address: 'mock_author',
                nickname: 'mock_nickname',
                avatar: 'mock_avatar_url',
                password: 'mock_password',
            };

            jest.spyOn(postService, 'getPostById').mockResolvedValueOnce({
                id: 1,
                content: 'Sample Post',
                mediaContentUrl: 'mock_media_url',
                author: mockUser,
                comments: [],
            });

            const createCommentDto: CreateCommentDto = {
                postId: 1,
                content: 'Test Comment',
            };

            const savedComment = { id: 1, ...createCommentDto, author: mockUser.address };

            jest.spyOn(commentRepository, 'create').mockReturnValueOnce(savedComment);
            jest.spyOn(commentRepository, 'save').mockResolvedValueOnce(savedComment);

            const result = await commentService.createComment(createCommentDto, mockUser);

            expect(result).toEqual(savedComment);
            expect(commentRepository.create).toHaveBeenCalledWith({
                author: mockUser.address,
                content: createCommentDto.content,
                postId: 1,
            });
            expect(commentRepository.save).toHaveBeenCalledWith(savedComment);
        });
    });
});