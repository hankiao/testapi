import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(6)
  password: string
}
