import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('hotels')
@UseGuards(JwtAuthGuard)
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto, @GetUser() user: User) {
    return this.hotelsService.create(createHotelDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.hotelsService.findAll(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.hotelsService.remove(+id, user.id);
  }
}
