import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {UserService} from "@src/user/user.service";
import {UserController} from "@src/user/user.controller";
import { UserEntity } from "@src/user/entities/user.entity"
import { AuthService } from "@src/user/auth.service"

@Module({
  imports: [ TypeOrmModule.forFeature([
     UserEntity
  ])],
  controllers: [UserController],
  providers: [UserService, AuthService]
})

export class UserModule {
}