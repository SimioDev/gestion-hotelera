import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    console.log('User from request in getProfile:', req.user);
    if (!req.user || typeof req.user.id !== 'number' || isNaN(req.user.id)) {
      throw new Error('Invalid user in request');
    }
    return req.user;
  }
}
