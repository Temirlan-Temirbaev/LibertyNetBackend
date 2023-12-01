import { ApiProperty } from "@nestjs/swagger"

export class CreateCommentDto {
  @ApiProperty({ example: "testContent" })
  readonly content: string
  @ApiProperty({ example: "1" })
  readonly postId: number
}
