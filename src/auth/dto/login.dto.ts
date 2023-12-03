import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches, MinLength } from "class-validator"

export class LoginDto {
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/g)
  readonly address: string
  @IsString()
  @MinLength(5)
  @ApiProperty({ example: "test12345" })
  readonly password: string
}
