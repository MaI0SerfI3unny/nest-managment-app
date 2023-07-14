import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./modules/users/users.module";
import { UserModel } from "./models/user.model";
import { UserRelationship } from "./models/user-relationship.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: process.env.HOST_SQL,
      port: parseInt(process.env.PORT_SQL),
      username: process.env.USERNAME_SQL,
      password: process.env.PASSWORD_SQL,
      database: process.env.DATABASENAME_SQL,
      autoLoadModels: true,
      synchronize: true,
      models: [UserModel, UserRelationship],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
