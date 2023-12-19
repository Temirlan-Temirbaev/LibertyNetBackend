import {CommentService} from "../src/comment/comment.service";


export const mockCommentService = {
    createComment: jest.fn((dto, user) => Promise.resolve(new Comment())),
    editComment: jest.fn((dto, user) => Promise.resolve(new Comment())),
    deleteComment: jest.fn((id, user) => Promise.resolve({ affected: 1 })),
};

export const mockCommentServiceProvider = {
    provide: CommentService,
    useValue: mockCommentService,
};
