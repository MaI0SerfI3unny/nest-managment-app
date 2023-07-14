import { Model } from 'sequelize-typescript';
export declare class UserModel extends Model {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    workers: UserModel[];
}
