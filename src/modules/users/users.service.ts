import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../models/user.model";
import { UserRelationship } from "../../models/user-relationship.model";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { ChangeBossDTO } from "src/dto/change-boss.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private User: typeof UserModel,
    @InjectModel(UserRelationship)
    private UserRelation: typeof UserRelationship,
    private jwtService: JwtService
  ) {}

  async checkAdminExists(): Promise<boolean> {
    const user = await this.User.findOne({
      where: { email: process.env.EMAIL_ADMIN },
    });
    if (!user) {
      const hash = await bcrypt.hash(process.env.PASS_ADMIN, 10);
      await this.User.create({
        firstName: process.env.NAME_ADMIN,
        lastName: process.env.SURNAME_ADMIN,
        email: process.env.EMAIL_ADMIN,
        password: hash,
        role: "admin",
      });
    }
    return true;
  }

  async findAll(user): Promise<{ info: UserModel; workers: UserModel[] }> {
    const info = await this.User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
    });

    if (user.role === "admin") {
      const workers = await this.User.findAll({
        where: { role: "boss" },
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
        ],
        attributes: { exclude: ["password"] },
      });
      return { info, workers };
    }

    if (user.role === "boss") {
      const workers = await this.User.findAll({
        where: { id: user.id },
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
        ],
        attributes: { exclude: ["password"] },
      });
      return { info, workers: workers[0].workers };
    }
    return { info, workers: [] };
  }

  async signUp(signUpDTO: SignUpDto): Promise<{ token: string }> {
    const { firstName, lastName, email, password, bossId, role } = signUpDTO;
    if (!firstName || !lastName || !email || !password || !role)
      throw new BadRequestException("No required params");

    const findUserByEmail = await this.User.findAll({ where: { email } });
    if (bossId) {
      const findBoss = await this.User.findOne({
        where: { id: bossId, role: "boss" },
      });
      if (!findBoss) throw new NotFoundException("Boss wasn`t founded");
    }

    if (bossId && role === "boss")
      throw new BadRequestException("Your role cannot have boss");

    if (!bossId && role === "user")
      throw new BadRequestException("Your role must have boss");

    if (findUserByEmail.length)
      throw new BadRequestException("Email already exist");

    const hash = await bcrypt.hash(password, 10);
    const user = await this.User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
    });

    if (bossId)
      await this.UserRelation.create({ workerId: user.id, bossId: bossId });

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: "2d" });
    return { token };
  }

  async login(SignInDTO: SignInDto): Promise<{ token: string }> {
    const { email, password } = SignInDTO;
    const findUser = await this.User.findOne({ where: { email } });
    if (!findUser) throw new UnauthorizedException("Invalid email or password");

    const isPassMatched = await bcrypt.compare(password, findUser.password);
    if (!isPassMatched)
      throw new UnauthorizedException("Invalid email or password");

    const token = this.jwtService.sign(
      { id: findUser.id },
      { expiresIn: "2d" }
    );
    return { token };
  }

  async changeBoss(
    ChangeBoss: ChangeBossDTO,
    user
  ): Promise<{ message: string }> {
    const { workerId, newBossId, bossId } = ChangeBoss;
    if (user.role === "user")
      throw new BadRequestException("You can`t have permissions");

    if (user.role === "boss") {
      const findExistWorker = await this.UserRelation.findOne({
        where: { bossId: user.id, workerId },
      });

      if (!findExistWorker)
        throw new NotFoundException(
          "Worker wasn`t founded or you do not control this user"
        );
    }

    await this.UserRelation.update(
      { bossId: newBossId },
      { where: { bossId, workerId } }
    );
    return { message: "Boss was successfully changed for user" };
  }
}
