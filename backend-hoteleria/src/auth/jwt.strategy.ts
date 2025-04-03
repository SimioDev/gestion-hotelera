import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key',
        });
    }

    async validate(payload: { email: string; sub: any }) {
        let userId;
        if (typeof payload.sub === 'number') {
            userId = payload.sub;
        } else if (typeof payload.sub === 'string') {
            userId = parseInt(payload.sub, 10);
        } else {
            throw new UnauthorizedException(`Invalid token payload: sub must be a number or string, got ${typeof payload.sub}`);
        }
        if (isNaN(userId) || userId <= 0) {
            throw new UnauthorizedException(`Invalid token payload: sub must be a valid number, got ${userId}`);
        }
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}
