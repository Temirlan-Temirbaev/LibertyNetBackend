import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  readonly address: string
  @ApiProperty({ example: "test12345" })
  readonly password: string
}
