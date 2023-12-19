import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../../src/comment/comment.controller';
import {mockCommentServiceProvider} from "../../mocks/comment.service.mock";
import {User} from "../../src/entities/user";
import {EditCommentDto} from "../../src/comment/dto/edit-comment.dto";
import {CommentService} from "../../src/comment/comment.service";
import {CreateCommentDto} from "../../src/comment/dto/create-comment.dto";

describe('CommentController', () => {
    let controller: CommentController;
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [mockCommentServiceProvider],
        }).compile();

        controller = module.get<CommentController>(CommentController);
        commentService = module.get<CommentService>(CommentService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createComment', () => {
        it('should create a comment', async () => {
            const createCommentDto: CreateCommentDto = { content: 'testContent', postId: 1 };
            const user: Partial<User> = { address: 'testUserAddress' };

            const result = await controller.createComment(createCommentDto, { user } as any);

            expect(result).toBeDefined();
            expect(commentService.createComment).toHaveBeenCalledWith(createCommentDto, user as User);
        });
    });

    describe('editComment', () => {
        it('should edit a comment', async () => {
            const editCommentDto: EditCommentDto = { content: 'testContent', id: 1 };
            const user: Partial<User> = { address: 'testUserAddress' };

            const result = await controller.editComment(editCommentDto, { user } as any);

            expect(result).toBeDefined();
            expect(commentService.editComment).toHaveBeenCalledWith(editCommentDto, user as User);
        });
    });

    describe('deleteComment', () => {
        it('should delete a comment', async () => {
            const commentId = 1;
            const user: Partial<User> = { address: 'testUserAddress' };

            const result = await controller.deleteComment(commentId, { user } as any);

            expect(result).toBeDefined();
            expect(commentService.deleteComment).toHaveBeenCalledWith(commentId, user as User);
        });
    });
});
