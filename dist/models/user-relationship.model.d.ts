import { Model } from 'sequelize-typescript';
export declare class UserRelationship extends Model<UserRelationship> {
    bossId: number;
    workerId: number;
}
