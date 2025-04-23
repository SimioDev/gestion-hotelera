import { IsNotEmpty, IsObject, ValidateNested, IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    coordinates: number[];
}

export class CreateHotelDto {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    name: string;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    city: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsNumber()
    employees?: number;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsString()
    managerName?: string;

    @IsOptional()
    @IsString()
    managerEmail?: string;

    @IsArray()
    services: string[];

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsArray()
    images?: string[];
}
