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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../models/user.model");
const user_relationship_model_1 = require("../../models/user-relationship.model");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(User, UserRelation, jwtService) {
        this.User = User;
        this.UserRelation = UserRelation;
        this.jwtService = jwtService;
    }
    async checkAdminExists() {
        const user = await this.User.findOne({ where: { email: process.env.EMAIL_ADMIN } });
        if (!user) {
            const hash = await bcrypt.hash(process.env.PASS_ADMIN, 10);
            await this.User.create({
                firstName: process.env.NAME_ADMIN,
                lastName: process.env.SURNAME_ADMIN,
                email: process.env.EMAIL_ADMIN,
                password: hash,
                role: "admin"
            });
        }
        return true;
    }
    async findAll(user) {
        const info = await this.User.findByPk(user.id, { attributes: { exclude: ['password'] } });
        if (user.role === "admin") {
            const workers = await this.User.findAll({
                where: { role: "boss" },
                include: [{
                        model: user_model_1.UserModel,
                        attributes: { exclude: ['password'] }
                    }],
                attributes: { exclude: ['password'] }
            });
            return { info, workers };
        }
        if (user.role === "boss") {
            const workers = await this.User.findAll({
                where: { id: user.id },
                include: [{
                        model: user_model_1.UserModel,
                        attributes: { exclude: ['password'] }
                    }],
                attributes: { exclude: ['password'] }
            });
            return { info, workers: workers[0].workers };
        }
        return { info, workers: [] };
    }
    async signUp(signUpDTO) {
        const { firstName, lastName, email, password, bossId, role } = signUpDTO;
        if (!firstName || !lastName || !email || !password || !role)
            throw new common_1.BadRequestException("No required params");
        const findUserByEmail = await this.User.findAll({ where: { email } });
        if (bossId) {
            const findBoss = await this.User.findOne({ where: { id: bossId, role: 'boss' } });
            if (!findBoss)
                throw new common_1.NotFoundException("Boss wasn`t founded");
        }
        if (bossId && role === "boss")
            throw new common_1.BadRequestException('Your role cannot have boss');
        if (!bossId && role === "user")
            throw new common_1.BadRequestException('Your role must have boss');
        if (findUserByEmail.length)
            throw new common_1.BadRequestException('Email already exist');
        const hash = await bcrypt.hash(password, 10);
        const user = await this.User.create({
            firstName, lastName, email, password: hash, role
        });
        if (bossId)
            await this.UserRelation.create({ workerId: user.id, bossId: bossId });
        const token = this.jwtService.sign({ id: user.id }, { expiresIn: '2d' });
        return { token };
    }
    async login(SignInDTO) {
        const { email, password } = SignInDTO;
        const findUser = await this.User.findOne({ where: { email } });
        if (!findUser)
            throw new common_1.UnauthorizedException("Invalid email or password");
        const isPassMatched = await bcrypt.compare(password, findUser.password);
        if (!isPassMatched)
            throw new common_1.UnauthorizedException("Invalid email or password");
        const token = this.jwtService.sign({ id: findUser.id }, { expiresIn: '2d' });
        return { token };
    }
    async changeBoss(ChangeBoss, user) {
        const { workerId, newBossId, bossId } = ChangeBoss;
        if (user.role === "user")
            throw new common_1.BadRequestException('You can`t have permissions');
        if (user.role === "boss") {
            const findExistWorker = await this.UserRelation.findOne({
                where: { bossId: user.id, workerId }
            });
            if (!findExistWorker)
                throw new common_1.NotFoundException("Worker wasn`t founded or you do not control this user");
        }
        await this.UserRelation.update({ bossId: newBossId }, { where: { bossId, workerId } });
        return { message: "Boss was successfully changed for user" };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __param(1, (0, sequelize_1.InjectModel)(user_relationship_model_1.UserRelationship)),
    __metadata("design:paramtypes", [Object, Object, jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map