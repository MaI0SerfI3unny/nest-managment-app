import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  NotEquals,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: "Please enter correct email" })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(["boss", "user"])
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @NotEquals(0)
  bossId: number;
}
