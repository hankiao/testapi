import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Öncelikle header'dan kontrol et
          const authHeader = req?.headers?.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
          }
          // Header yoksa cookie'den oku
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'superSecretKey',
      passReqToCallback: true,
    })
  }

  async validate(payload: JwtPayload, req: Request) {
    // Burada istersen log da koyabilirsin
    console.log('Validate called with payload:', payload);
    console.log('Headers:', req.headers);

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    return user;
  }

}
