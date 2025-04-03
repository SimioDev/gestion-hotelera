import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    coordinates: number[];
}

export class CreateHotelDto {
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

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    employees: number;

    logoUrl?: string;
    managerName?: string;
    managerEmail?: string;
    services?: string[];
}
