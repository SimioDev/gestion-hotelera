import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HotelsService {
  constructor(
      @InjectRepository(Hotel)
      private hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto, user: User): Promise<Hotel> {
    const hotel = this.hotelsRepository.create({
      ...createHotelDto,
      services: createHotelDto.services || [],
      user,
    });
    return this.hotelsRepository.save(hotel);
  }

  async findAll(userId: number): Promise<Hotel[]> {
    return this.hotelsRepository.find({ where: { user: { id: userId } } });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.hotelsRepository.delete({ id, user: { id: userId } });
  }
}
