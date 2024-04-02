import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  available_occupancy: number;
}
