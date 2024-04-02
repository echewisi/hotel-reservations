import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { CreateHotelDto } from '../dto/create-reservation.dto';
import { KafkaProducerService } from 'src/kafka/kakfa.producer';
import { BadRequestException, NotFoundException } from '@nestjs/common';
@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async createHotel(createHotelDto: CreateHotelDto): Promise<HotelEntity> {
    const { name, available_occupancy } = createHotelDto;
    const hotel = new HotelEntity();
    hotel.name = name;
    hotel.available_occupancy = available_occupancy;
    hotel.occupancy_filled = false; // Initially set to false
    return this.hotelRepository.save(hotel);
  }

  async bookHotel(
    hotelTag: string,
    userId: string,
    email: string,
  ): Promise<any> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_tag: hotelTag },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // Check if the hotel is fully occupied
    if (hotel.occupancy_filled) {
      throw new BadRequestException('Hotel occupancy filled');
    }

    // Decrement available occupancy by 1
    hotel.available_occupancy -= 1;
    if (hotel.available_occupancy === 0) {
      hotel.occupancy_filled = true;
    }
    await this.hotelRepository.save(hotel);

    // Generate a random room number (3 digits)
    const roomNumber = Math.floor(100 + Math.random() * 900);

    // Add user to the list of occupants
    if (!hotel.occupants) {
      hotel.occupants = [];
    }
    hotel.occupants.push(userId);
    await this.hotelRepository.save(hotel);

    await this.kafkaProducerService.sendHotelBookedEvent(hotelTag);
    return { roomNumber, hotelName: hotel.name, userId, email };
  }

  async getHotelByTag(hotelTag: string): Promise<HotelEntity> {
    return this.hotelRepository.findOne({ where: { hotel_tag: hotelTag } });
  }

  async getAvailableHotels(): Promise<HotelEntity[]> {
    return this.hotelRepository.find({ where: { occupancy_filled: false } });
  }
}
