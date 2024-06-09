import { IsNumber, IsString } from "class-validator"

export class JwtDto{
   @IsString()
   name: string

   @IsNumber()
   iat: number

   @IsNumber()
   exp: number
}