import { ApiProperty } from "@nestjs/swagger"

export class EditPostDto {
  @ApiProperty({ example: "1" })
  readonly id: number
  @ApiProperty({ example: "testContent" })
  readonly content: string
  @ApiProperty({ example: "media.com" })
  readonly mediaContentUrl: string
}
