import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-reservations.dto';
import { BookHotelDto } from './dto/book-hotel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);
  }

  @Post('book')
  @UseGuAuthGuard('jwt'))
  async bookHotel(@Body() bookHotelDto: BookHotelDto, @Req() req) {
    const { hotel_tag, email, password } = bookHotelDto;
    const userId = req.user.id; // Assuming user ID is available in request

    // Check if the user's credentials are valid
    const isValidCredentials = await this.authService.validateUser(
      email,
      password,
    );
    if (!isValidCredentials) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.hotelService.bookHotel(hotel_tag, userId);
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
