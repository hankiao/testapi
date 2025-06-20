import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    const { password: _, ...result } = user
    return result
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(registerDto: any) {
    // Register işlemini usersService ile yapacağız, hash dahil
    return this.usersService.createUser(registerDto)
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);  // Token geçerliliğini kontrol et
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
