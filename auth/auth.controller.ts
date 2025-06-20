import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('auth') // Swagger'da "auth" kategorisini oluşturur
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login DTO:', loginDto)
    return this.authService.login(loginDto)
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('validate')
  async validateToken(@Body('access_token') token: string) {
    try {
      const valid = await this.authService.verifyToken(token);
      return { valid };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
