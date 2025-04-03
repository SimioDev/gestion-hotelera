import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async updateChainName(id: number, chainName: string): Promise<User> {
    if (isNaN(id) || id <= 0) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    await this.usersRepository.update(id, { chainName });
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Invalid user ID for email ${email}: ${user.id}`);
      }
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    if (isNaN(id) || id <= 0) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Invalid user ID for id ${id}: ${user.id}`);
      }
    }
    return user;
  }
}
