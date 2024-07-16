import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService
    ) {}

  async signIn(username: string, birthdate: string):Promise<{ access_token: string }>{
    const user = await this.usersService.findByUsername(username);
    if (user?.birthdate !== birthdate || user?.username !== username) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}