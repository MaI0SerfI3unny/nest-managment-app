import { Table, Model, Column, ForeignKey } from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({
  tableName: "user_relationships",
  createdAt: false,
  updatedAt: false,
})
export class UserRelationship extends Model<UserRelationship> {
  @ForeignKey(() => UserModel)
  @Column
  bossId: number;

  @ForeignKey(() => UserModel)
  @Column
  workerId: number;
}
