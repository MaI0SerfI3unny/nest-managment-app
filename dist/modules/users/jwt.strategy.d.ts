import { UserModel } from "../../models/user.model";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private User;
    constructor(User: typeof UserModel);
    validate(payload: any): Promise<UserModel>;
}
export {};
