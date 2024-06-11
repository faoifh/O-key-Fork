import { Controller, Post, Res, UseGuards, Request } from "@nestjs/common"
import { CheckTokenService } from "@src/check-token/check-token.service"
import { JwtAuthGuard } from "@src/check-token/guards/jwt-auth.guard"
import { RefreshJwtAuthGuard } from "@src/check-token/guards/refresh-jwt-auth.guard"

@Controller('check-token')
export class CheckTokenController {
   constructor(
      private readonly checkTokenService: CheckTokenService
   ) {
   }
   @UseGuards(JwtAuthGuard)
   @Post("/check/accessToken")
   checkAccessToken(@Request() req: any): boolean {
      return req.user
   }

   @UseGuards(RefreshJwtAuthGuard)
   @Post("/check/refreshToken")
   checkRefreshToken(@Request() req: any, @Res({ passthrough: true }) res: any) {

      if (req.user === "reset") {
         res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true
         })
      }

      res.setHeader("Authorization", "Bearer " + req.user)

   }
}
