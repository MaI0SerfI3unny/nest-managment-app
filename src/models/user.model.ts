import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table, BelongsToMany } from "sequelize-typescript";
import { UserRelationship } from "./user-relationship.model";

@Table({
  tableName: "users",
  createdAt: false,
  updatedAt: false,
})
export class UserModel extends Model {
  @Column
  @ApiProperty()
  firstName: string;

  @Column
  @ApiProperty()
  lastName: string;

  @Column
  @ApiProperty()
  email: string;

  @Column
  @ApiProperty()
  role: string;

  @Column
  @ApiProperty()
  password: string;

  @BelongsToMany(() => UserModel, () => UserRelationship, "bossId", "workerId")
  workers: UserModel[];
}
