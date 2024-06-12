import { Injectable } from "@nestjs/common"
import { JwtDto } from "@src/check-token/dto/jwt.dto"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "@src/check-token/entities/user.entity"
import { Repository } from "typeorm"
import { jwtConstants } from "@src/constants"

@Injectable()
export class CheckTokenService {

   constructor(
      private jwtService: JwtService,
      @InjectRepository(UserEntity) private userInfoRepository: Repository<UserEntity>

   ) {
   }

   async checkAccessToken(token: JwtDto): Promise<boolean> {
      return await this.userInfoRepository.exists({
         where: {
            name: token.name
         }
      })
   }

   async checkRefreshToken(token: JwtDto): Promise<boolean> {
      // db값과 token값이 같은지 확인
      try {
         const dbRefreshToken = await this.userInfoRepository.findOne({
            where: {
               name: token.name
            }
         })

         const decodeRefreshToken = this.jwtService.verify(dbRefreshToken.refresh_token, {
            secret: jwtConstants.REFRESH_TOKEN_SECRET
         })

         return dbRefreshToken.name === decodeRefreshToken.name
      } catch (err) {

         return false
      }
   }
}
