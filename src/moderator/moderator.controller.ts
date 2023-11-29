import {Body, Controller, Patch, UseGuards} from '@nestjs/common';
import {ModeratorService} from './moderator.service';
import {SwitchRoleDto} from "./dto/switch-role.dto";
import {Role} from "../auth/decorators/role.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RoleGuard} from "../auth/guards/role.guard";
import {IsBannedGuard} from "../auth/guards/is-banned.guard";

@Controller('moderator')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {
  }

  @Patch("")
  @Role(["admin"])
  @UseGuards(JwtAuthGuard, RoleGuard)
  switchRole(@Body() dto: SwitchRoleDto) {
    return this.moderatorService.switchRole(dto);
  }

  @Patch("ban")
  @Role(["moderator", "admin"])
  @UseGuards(JwtAuthGuard, RoleGuard, IsBannedGuard)
  switchBanned(@Body() dto: { readonly address: string }) {
    return this.moderatorService.switchBanned(dto.address);
  }
}
