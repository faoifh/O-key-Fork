import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "@src/user/user.service";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post("/register")
    getRegister(@Body() userInfo: RegisterUserDto) {
        return this.userService.userRegister(userInfo)
    }}
