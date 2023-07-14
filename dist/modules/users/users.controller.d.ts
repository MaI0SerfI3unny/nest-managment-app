import { UsersService } from './users.service';
import { UserModel } from '../../models/user.model';
import { SignInDto } from 'src/dto/sign-in.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { ChangeBossDTO } from 'src/dto/change-boss.dto';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getLists(req: any): Promise<{
        info: UserModel;
        workers: UserModel[];
    }>;
    signUp(User: SignUpDto): Promise<{
        token: string;
    }>;
    login(SignIn: SignInDto): Promise<{
        token: string;
    }>;
    changeBoss(ChangeBoss: ChangeBossDTO, req: any): Promise<{
        message: string;
    }>;
}
