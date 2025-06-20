import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEmail, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class UrlDto {
    @ApiProperty({ example: 'https://example.com' })
    @IsString()
    value: string;
}

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @ApiProperty({ required: false, type: [UrlDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UrlDto)
    urls?: UrlDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    zip?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    activeTheme?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;
}
