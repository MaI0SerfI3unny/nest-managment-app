import { UserModel } from '../../models/user.model';
import { UserRelationship } from '../../models/user-relationship.model';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/dto/sign-in.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { ChangeBossDTO } from 'src/dto/change-boss.dto';
export declare class UsersService {
    private User;
    private UserRelation;
    private jwtService;
    constructor(User: typeof UserModel, UserRelation: typeof UserRelationship, jwtService: JwtService);
    checkAdminExists(): Promise<boolean>;
    findAll(user: any): Promise<{
        info: UserModel;
        workers: UserModel[];
    }>;
    signUp(signUpDTO: SignUpDto): Promise<{
        token: string;
    }>;
    login(SignInDTO: SignInDto): Promise<{
        token: string;
    }>;
    changeBoss(ChangeBoss: ChangeBossDTO, user: any): Promise<{
        message: string;
    }>;
}
