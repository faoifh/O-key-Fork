import { Injectable, UnauthorizedException } from "@nestjs/common"
import { RegisterDto } from "@src/user/dto/register.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "@src/user/entities/user.entity"
import { Repository } from "typeorm"

import * as bcrypt from "bcrypt"
import { LoginDto } from "@src/user/dto/login.dto"
import { AuthService } from "@src/user/auth.service"

@Injectable()
export class UserService {
   constructor(
      private authService: AuthService,
      @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
   }

   public async register(userInfo: RegisterDto) {

      const isExist: boolean = await this.userRepository.exists({
         where: {
            id: userInfo.id
         }
      })

      if (!isExist) {

         const encryptPassword = await this.encryptPassword(userInfo.password)

         await this.userRepository.insert({
            ...userInfo,
            password: encryptPassword
         })

         return `${userInfo.name} Success Register!`
      }

      return false

   }

   public async login(userInfo: LoginDto) {
      // 유저 존재 확인
      const checkUserResult = await this.checkExistUser(userInfo.id)

      if (checkUserResult.hasOwnProperty("error")) {
         throw new UnauthorizedException(checkUserResult.error)
      }

      // 비밀번호 유효성 확인
      const checkPassword = await this.validatePassword(userInfo.password, checkUserResult.password)

      if (!checkPassword) {
         throw new UnauthorizedException("User not found")
      }

      // 모든 조건 통과
      // token 발급
      return await this.authService.generateToken({
         "id": checkUserResult.id,
         "name": checkUserResult.name
      })
   }

   private async encryptPassword(password: string) {
      const saltRounds = 10

      const passwordSalt: string = await bcrypt.genSalt(saltRounds)

      return await bcrypt.hash(password, passwordSalt)
   }


   private async checkExistUser(id: string) {
      const existUser = await this.userRepository.findOne({
         select: ["id", "name", "password"],
         where: {
            "id": id
         }
      })

      if (existUser === null) return {
         "error": "User not found"
      }

      return {
         "id": existUser.id,
         "name": existUser.name,
         "password": existUser.password
      }
   }

   // 비밀번호 유효성 검사
   private async validatePassword(password: string, formPassword: string) {

      return await bcrypt.compare(password, formPassword) === true
   }
}

