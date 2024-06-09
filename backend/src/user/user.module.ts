import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {UserService} from "@src/user/user.service";
import {UserController} from "@src/user/user.controller";
import { UserEntity } from "@src/user/entities/user.entity"

@Module({
  imports: [ TypeOrmModule.forFeature([
     UserEntity
  ])],
  controllers: [UserController],
  providers: [UserService]
})

export class UserModule {
}