import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "@src/check-token/entities/user.entity"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { JwtStrategy } from "@src/check-token/guards/jwt.strategy"
import { RefreshJwtStrategy } from "@src/check-token/guards/refresh-jwt-auth.strategy"
import { CheckTokenController } from "@src/check-token/check-token.controller"
import { CheckTokenService } from "@src/check-token/check-token.service"
import { AuthService } from "@src/user/auth.service"
import { PassportModule } from "@nestjs/passport"
import { jwtConstants } from "@src/constants"
import { UserModule } from "@src/user/user.module"

@Module({
   imports: [
      UserModule,
      TypeOrmModule.forFeature([UserEntity]), PassportModule.register({
      defaultStrategy: "jwt"
   }),
      JwtModule.register({
         secret: jwtConstants.ACCESS_TOKEN_SECRET,
         signOptions: { expiresIn: "5m" }
      })],
   controllers: [CheckTokenController],
   providers: [JwtStrategy, RefreshJwtStrategy, JwtService, CheckTokenService, AuthService]
})

export class CheckTokenModule {
}