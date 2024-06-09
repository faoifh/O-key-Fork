import { Injectable } from "@nestjs/common"
import { RegisterDto } from "@src/user/dto/register.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "@src/user/entities/user.entity"
import { Repository } from "typeorm"

import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
   constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
   }

   public async userRegister(userInfo: RegisterDto) {

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


   private async encryptPassword(password:string) {
      const saltRounds = 10

      const passwordSalt: string = await bcrypt.genSalt(saltRounds)

      return await bcrypt.hash(password, passwordSalt)
   }
}

