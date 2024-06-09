import {Column} from "typeorm";
import {IsString} from "class-validator";

export class RegisterDto {
    @IsString()
    id: string

    @IsString()
    password: string

    @IsString()
    name: string

    @IsString()
    interests: string
}