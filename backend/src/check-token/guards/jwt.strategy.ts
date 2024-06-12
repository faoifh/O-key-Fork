import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { jwtConstants } from "@src/constants"
import { JwtDto } from "../dto/jwt.dto"
import { CheckTokenService } from "@src/check-token/check-token.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(private readonly checkTokenService: CheckTokenService) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration:
            false,
         secretOrKey:
         jwtConstants.ACCESS_TOKEN_SECRET
      })
   }

   async validate(token: JwtDto): Promise<boolean> {
      const result: boolean = await this.checkTokenService.checkAccessToken(token)

      if (result) {
         console.log(`${token.name}: access token 통과`)
         return true
      } else {
         throw new UnauthorizedException()
      }
   }
}