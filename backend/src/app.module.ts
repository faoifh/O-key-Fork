import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as process from "process"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from './user/user.module';
import { UserEntity } from "@src/user/entities/user.entity"
import { CheckTokenModule } from './check-token/check-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "production" ? ".production.env" : ".development.env"
    }),
    TypeOrmModule.forRoot({
      type: "mariadb",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: false,
    }),
    UserModule,
    CheckTokenModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
