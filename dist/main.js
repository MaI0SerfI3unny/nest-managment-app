"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./modules/users/users.service");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Managment CRM engine')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: "bearer",
        name: 'Authorization',
        in: 'header'
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const userService = app.get(users_service_1.UsersService);
    const adminExists = await userService.checkAdminExists();
    if (adminExists)
        console.log("Admin exist in database");
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map