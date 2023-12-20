import { Post } from '../src/entities/post';
import { User } from '../src/entities/user';
import { Comment } from '../src/entities/comment';

export class MockPostService {
    getPostById(id: number): Promise<Post> {
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

        const mockComment: Comment = {
            id: 1,
            author: 'mock_author',
            content: 'mock_comment_content',
            postId: 1,
        };

        const mockPost: Post = {
            id,
            content: `Mock Post ${id}`,
            mediaContentUrl: 'mock_media_url',
            author: mockUser,
            comments: [mockComment],
        };

        return Promise.resolve(mockPost);
    }
}
