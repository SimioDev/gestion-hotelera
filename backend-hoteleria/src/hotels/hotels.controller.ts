import { Controller, Get, Post, Body, Delete, Param, UseGuards, BadRequestException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('hotels')
@UseGuards(JwtAuthGuard)
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
      @Body() createHotelDto: CreateHotelDto,
      @UploadedFiles() files: Array<Express.Multer.File>,
      @GetUser() user: User,
  ) {
    if (!user.chainName || user.chainName.trim() === '') {
      throw new BadRequestException('No puedes crear una propiedad sin definir el nombre de la inmobiliaria primero.');
    }

    if (createHotelDto.type === 'hotel') {
      if (createHotelDto.employees == null) {
        throw new BadRequestException('Para un hotel, el campo employees es obligatorio.');
      }
      if (!createHotelDto.logoUrl) {
        throw new BadRequestException('Para un hotel, el campo logoUrl es obligatorio.');
      }
    } else if (['casa', 'apartamento', 'terreno'].includes(createHotelDto.type)) {
      if (createHotelDto.price == null) {
        throw new BadRequestException('Para una propiedad inmobiliaria, el campo price es obligatorio.');
      }
    } else {
      throw new BadRequestException('El tipo debe ser "hotel", "casa", "apartamento" o "terreno".');
    }

    const imageUrls = files ? files.map((file) => `/uploads/${file.filename}`) : [];
    createHotelDto.images = imageUrls;

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
