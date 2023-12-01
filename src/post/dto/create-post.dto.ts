import { ApiProperty } from "@nestjs/swagger"

export class CreatePostDto {
  @ApiProperty({ example: "testContent" })
  readonly content: string
  @ApiProperty({ example: "media.com" })
  readonly mediaContentUrl: string
}
