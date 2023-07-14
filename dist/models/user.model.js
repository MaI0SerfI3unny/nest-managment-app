"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_relationship_model_1 = require("./user-relationship.model");
let UserModel = UserModel_1 = class UserModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "firstName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "lastName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => UserModel_1, () => user_relationship_model_1.UserRelationship, 'bossId', 'workerId'),
    __metadata("design:type", Array)
], UserModel.prototype, "workers", void 0);
UserModel = UserModel_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        createdAt: false,
        updatedAt: false,
    })
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map