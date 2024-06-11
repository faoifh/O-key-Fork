import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { jwtConstants } from "@src/constants"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "@src/user/entities/user.entity"

@Injectable()
export class AuthService {
   constructor(
      private jwtService: JwtService,
      @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
   ) {
   }

   async generateAccessToken(user: {
      name: string
   }): Promise<string> {
      const payload = { name: user.name }
      return this.jwtService.sign(payload, {
         secret: jwtConstants.ACCESS_TOKEN_SECRET,
         expiresIn: "5m"
      })
   }

   async generateRefreshToken(user: {
      name: string
   }): Promise<string> {
      const payload = { name: user.name }

      return this.jwtService.sign(payload, {
         secret: jwtConstants.REFRESH_TOKEN_SECRET,
         expiresIn: "1d"
      })
   }

   async generateToken(userInfo: {
      id: string
      name: string,
   }) {
      const payload = { name: userInfo.name }

      const accessToken: string = await this.generateAccessToken(payload)
      const refreshToken: string = await this.generateRefreshToken(payload)

      await this.userRepository.update({ id: userInfo.id }, {
         refresh_token: refreshToken
      })

      return {
         name: userInfo.name,
         accessToken,
         refreshToken
      }
   }

}
