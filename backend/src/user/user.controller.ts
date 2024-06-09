import { Body, Controller, Post } from "@nestjs/common"
import { UserService } from "@src/user/user.service"
import { RegisterDto } from "@src/user/dto/register.dto"

@Controller("user")
export class UserController {

   constructor(private readonly userService: UserService) {
   }

   @Post("/register")
   getRegister(@Body() userInfo: RegisterDto) {
      return this.userService.userRegister(userInfo)
   }
}