import { Controller, Get, Patch, Post, Request, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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
