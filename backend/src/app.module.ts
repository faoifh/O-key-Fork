import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as process from "process"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from './user/user.module';

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
      entities: [],
      synchronize: false,
    }),
    UserModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
