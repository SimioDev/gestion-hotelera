import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import { IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;
}
