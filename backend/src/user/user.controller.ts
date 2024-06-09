import { Body, Request, Controller, Post, Res } from "@nestjs/common"
import { UserService } from "@src/user/user.service"
import { RegisterDto } from "@src/user/dto/register.dto"
import { LoginDto } from "@src/user/dto/login.dto"
import { AuthService } from "@src/user/auth.service"

@Controller("user")
export class UserController {

   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService
   ) {
   }

   @Post("/register")
   register(@Body() userInfo: RegisterDto) {
      return this.userService.register(userInfo)
   }

   @Post("/login")
   async login(@Request() req: any, @Res({ passthrough: true }) res: any) {
      const { accessToken, refreshToken } = await this.authService.login(req.user)

      res.setHeader("Authorization", "Bearer " + accessToken)

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: true
         // maxAge: 24 * 60 * 60 * 1000
      })

      return {
         "message": `${req.user.name} login successful!`
      }
   }
}