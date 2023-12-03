import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches, MinLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/g)
  readonly address: string
  @ApiProperty({ example: "test12345" })
  @IsString()
  @MinLength(5)
  readonly password: string
  @ApiProperty({ example: "foofie213" })
  readonly nickname: string
  @ApiProperty({ example: "avatar.com" })
  readonly avatar: string
}
