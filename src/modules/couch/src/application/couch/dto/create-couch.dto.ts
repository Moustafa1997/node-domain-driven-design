import { IsNumber, IsString, Min, IsDefined } from "class-validator";

export class CreateCouchDto {
  @IsDefined()
  hostId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  constructor(props: CreateCouchDto) {
    Object.assign(this, props);
  }
}
