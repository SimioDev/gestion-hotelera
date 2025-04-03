import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = { email: user.email, sub: user.id };
        if (typeof user.id !== 'number') {
            throw new Error('User ID must be a number');
        }
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
