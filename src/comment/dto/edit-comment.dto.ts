import { ApiProperty } from "@nestjs/swagger"

export class EditCommentDto {
  @ApiProperty({ example: "testContent" })
  readonly content: string
  @ApiProperty({ example: "1" })
  readonly id: number
}
