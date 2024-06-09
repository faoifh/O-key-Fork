import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { JwtDto } from "../dto/jwt.dto"
import { CheckTokenService } from "@src/check-token/check-token.service"
import { jwtConstants } from "@src/constants"
import { AuthService } from "@src/user/auth.service"

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
   constructor(
      private readonly checkTokenService: CheckTokenService,
      private readonly authService: AuthService,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([
            (request: any) => {
               let token = null
               if (request && request.cookies) {
                  token = request.cookies["refresh_token"]
               }
               return token
            }
         ]),
         ignoreExpiration: true,
         secretOrKey: jwtConstants.REFRESH_TOKEN_SECRET
      })

   }

   async validate(token: JwtDto): Promise<string> {
      const checkResult: boolean = await this.checkTokenService.checkRefreshToken(token)


      if (checkResult) {
         console.log("refresh token 통과")

         return await this.authService.generateAccessToken(token)

      } else {
         console.log("refresh까지 만료, 로그인 요청")

         // 유효하지 않을 때, 쿠키를 전부 삭제해주기 위함.
         // 원래는 false로 return해서 유효하지않은 값은 함수로 들어가게해서는 안된다.
         return "reset"
      }
   }
}