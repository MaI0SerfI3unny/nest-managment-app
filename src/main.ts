import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { UsersService } from "./modules/users/users.service";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Managment CRM engine")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      name: "Authorization",
      in: "header",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const userService = app.get(UsersService);
  const adminExists = await userService.checkAdminExists();
  if (adminExists) console.log("Admin exist in database");
  await app.listen(3000);
}
bootstrap();
