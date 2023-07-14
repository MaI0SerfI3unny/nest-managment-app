import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UserModel } from "../../models/user.model";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { ChangeBossDTO } from "src/dto/change-boss.dto";

@ApiTags("user")
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get("/lists")
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getLists(@Req() req): Promise<{ info: UserModel; workers: UserModel[] }> {
    return this.userService.findAll(req.user);
  }

  @Post("/sign-up")
  @UsePipes(new ValidationPipe())
  signUp(@Body() User: SignUpDto): Promise<{ token: string }> {
    return this.userService.signUp(User);
  }

  @Post("/sign-in")
  login(@Body() SignIn: SignInDto): Promise<{ token: string }> {
    return this.userService.login(SignIn);
  }

  @Put("/change-boss")
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  changeBoss(
    @Body() ChangeBoss: ChangeBossDTO,
    @Req() req
  ): Promise<{ message: string }> {
    return this.userService.changeBoss(ChangeBoss, req.user);
  }
}
