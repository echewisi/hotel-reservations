import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from 'src/dto/create-reservation.dto';
import { BookHotelDto } from '../dto/book-hotel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);
  }

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  async bookHotel(@Body() bookHotelDto: BookHotelDto, @Req() req) {
    const { hotel_tag, email } = bookHotelDto;
    const userId = req.user.id;
    const user_email = email; // Assuming user ID is available in request

    return this.hotelService.bookHotel(hotel_tag, userId, user_email);
  }

  @Get(':hotel_tag')
  async getHotelDetails(@Param('hotel_tag') hotelTag: string) {
    const hotel = await this.hotelService.getHotelByTag(hotelTag);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  @Get('available')
  async getAvailableHotels() {
    return this.hotelService.getAvailableHotels();
  }
}
