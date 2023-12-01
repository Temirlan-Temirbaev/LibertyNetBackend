import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  readonly address: string
  @ApiProperty({ example: "test12345" })
  readonly password: string
  @ApiProperty({ example: "foofie213" })
  readonly nickname: string
  @ApiProperty({ example: "avatar.com" })
  readonly avatar: string
}
