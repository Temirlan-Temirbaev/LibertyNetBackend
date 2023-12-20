import { Module } from '@nestjs/common';
import { MockUserService } from './mock-user.service';

@Module({
    providers: [MockUserService],
    exports: [MockUserService],
})
export class MockUserModule {}
