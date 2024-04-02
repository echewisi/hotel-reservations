import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class BookHotelDto {
  @IsNotEmpty()
  @IsString()
  hotel_tag: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
