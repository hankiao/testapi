import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsString() // Doğrulama: String olmalı
  username: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @IsEmail() // Doğrulama: Geçerli bir email adresi olmalı
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword123',
  })
  @IsString() // Doğrulama: String olmalı
  @MinLength(6) // Doğrulama: Minimum 6 karakter uzunluğunda olmalı
  password: string
}
