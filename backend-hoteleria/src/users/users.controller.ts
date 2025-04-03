import { Controller, Get, Patch, Request, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    if (!req.user || typeof req.user.id !== 'number' || isNaN(req.user.id)) {
      throw new Error('Invalid user in request');
    }
    return req.user;
  }

  @Patch('me/chain-name')
  @UseGuards(JwtAuthGuard)
  async updateChainName(@Request() req, @Body('chainName') chainName: string) {
    if (!req.user || typeof req.user.id !== 'number' || isNaN(req.user.id)) {
      throw new Error('Invalid user in request');
    }
    const updatedUser = await this.usersService.updateChainName(req.user.id, chainName);
    return updatedUser;
  }
}
