import { IsNotEmpty, IsNumber, NotEquals } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeBossDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  workerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  newBossId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  bossId: number;
}
