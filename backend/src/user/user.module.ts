import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {UserService} from "@src/user/user.service";
import {UserController} from "@src/user/user.controller";

@Module({
  imports: [ TypeOrmModule.forFeature([

  ])],
  controllers: [UserService],
  providers: [UserController]
})

export class UserModule {
}