import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "@src/user/user.service"
import { UserController } from "@src/user/user.controller"
import { UserEntity } from "@src/user/entities/user.entity"
import { AuthService } from "@src/user/auth.service"
import { JwtService } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

@Module({
   imports: [
      TypeOrmModule.forFeature([UserEntity]),
      PassportModule.register({
         defaultStrategy: "jwt"
      }),
   ],
   controllers: [UserController],
   providers: [UserService, AuthService, JwtService],
   exports: [AuthService, UserService]
})

export class UserModule {
}