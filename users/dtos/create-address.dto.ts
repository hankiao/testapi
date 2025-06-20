import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { AddressType } from '../entities/address.entity';

export class CreateAddressDto {
    @ApiProperty({ example: 'billing', enum: AddressType })
    @IsEnum(AddressType)
    type: AddressType;

    @ApiProperty({ example: '123 Main St' })
    @IsString()
    street: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    country: string;

    @ApiProperty({ example: '10001' })
    @IsString()
    postalCode: string;
}
