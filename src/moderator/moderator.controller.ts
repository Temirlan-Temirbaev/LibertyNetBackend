import { Body, Controller, Patch, UseGuards } from "@nestjs/common"
import { ModeratorService } from "./moderator.service"
import { SwitchRoleDto } from "./dto/switch-role.dto"
import { Role } from "../auth/decorators/role.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RoleGuard } from "../auth/guards/role.guard"
import { IsBannedGuard } from "../auth/guards/is-banned.guard"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { User } from "../entities/user"

@ApiTags("Moderator")
@Controller("moderator")
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @ApiOperation({ summary: "Switch role" })
  @ApiResponse({ status: 200, type: User })
  @Patch("")
  @Role(["admin"])
  @UseGuards(JwtAuthGuard, RoleGuard)
  switchRole(@Body() dto: SwitchRoleDto) {
    return this.moderatorService.switchRole(dto)
  }

  @ApiOperation({ summary: "Switch isBanned" })
  @ApiResponse({ status: 200, type: User })
  @Patch("ban")
  @Role(["moderator", "admin"])
  @UseGuards(JwtAuthGuard, RoleGuard, IsBannedGuard)
  switchBanned(@Body() dto: { readonly address: string }) {
    return this.moderatorService.switchBanned(dto.address)
  }
}
