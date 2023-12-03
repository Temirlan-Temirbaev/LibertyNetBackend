import { ApiProperty } from "@nestjs/swagger"

export class CreateMessageDto {
  @ApiProperty({ example: "testContent" })
  readonly content: string
  @ApiProperty({ example: 1 })
  readonly conversationId: number
}
